import { NextResponse } from 'next/server';
import { createClientADM } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email, authMethod, password, profileData } = await req.json();
    
    // NIEUW: Haal de ID van de ingelogde beheerder op voor de audit log
    // Dit werkt als je de request headers doorgeeft of de admin client gebruikt
    const actorId = profileData.admin_id; 

    let userId: string;

    // A. Gebruiker aanmaken in Auth
    if (authMethod === 'invite') {
      const { data, error } = await createClientADM.auth.admin.inviteUserByEmail(email, {
        // BELANGRIJK: metadata direct meegeven bij invite
        data: { 
          role: profileData.app_role, 
          is_patient: profileData.is_patient || false,
          full_name: `${profileData.first_name} ${profileData.last_name}`
        }
      });
      if (error) throw error;
      userId = data.user.id;
    } else {
      const { data, error } = await createClientADM.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        // BELANGRIJK: metadata synchroniseren met de database rol
        user_metadata: { 
          role: profileData.app_role, 
          is_patient: profileData.is_patient || false,
          full_name: `${profileData.first_name} ${profileData.last_name}` 
        }
      });
      if (error) throw error;
      userId = data.user.id;
    }

    // B. Profiel aanmaken in Public schema (blijft grotendeels gelijk)
    const { error: pError } = await createClientADM.from('profiles').insert({
      id: userId,
      email: email,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      full_name: `${profileData.first_name} ${profileData.last_name}`,
      app_role: profileData.app_role, // Zorg dat dit overeenkomt met de metadata
      bsn_number: profileData.bsn_number,
      is_patient: profileData.is_patient || false,
      is_active: true,
      updated_at: new Date().toISOString()
    });

    if (pError) throw pError;

    // C. Optioneel: Staff membership koppeling
    if (profileData.organization_id && !profileData.is_patient) {
      const { error: mError } = await createClientADM
        .from('staff_memberships')
        .insert({
          user_id: userId,
          organization_id: profileData.organization_id
        });
      
      if (mError) console.error("Staff membership koppeling mislukt:", mError);
    }

    // D. NEN 7513 Audit Log injectie
    // Dit legt vast DAT er een gebruiker is aangemaakt voor de audit trail
    await createClientADM.from('nen7513_logs').insert({
      action: 'CREATE_USER',
      actor_user_id: actorId, // Nu weten we wie het gedaan heeft
      resource_type: 'USER_PROFILE',
      resource_id: userId,
      description: `Account aangemaakt: ${email} (Rol: ${profileData.app_role})`,
      status: 'success'
    });

    return NextResponse.json({ success: true, userId });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PUT: Gebruiker Heractiveren of Wijzigen
export async function PUT(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (action === 'reactivate') {
      // 1. Update Profiel
      const { error: pError } = await createClientADM
        .from('profiles')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (pError) throw pError;

      // 2. Log deze actie
      await createClientADM.from('nen7513_logs').insert({
        action: 'REACTIVATE_USER',
        resource_type: 'USER_PROFILE',
        resource_id: userId,
        description: `Gebruikersaccount opnieuw geactiveerd`,
        status: 'success'
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Ongeldige actie' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Definitief verwijderen (Hard Delete)
export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    // 1. Verwijder uit Auth (Dit triggert niets in public, dus we moeten profiles apart doen)
    const { error: authError } = await createClientADM.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Verwijder uit Profiles 
    // Dankzij het SQL script hierboven worden logs nu automatisch geanonimiseerd (SET NULL)
    // en staff_memberships automatisch verwijderd (CASCADE).
    const { error: profileError } = await createClientADM
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // 3. Log het succes
    await createClientADM.from('nen7513_logs').insert({
      action: 'HARD_DELETE_USER',
      resource_type: 'SYSTEM',
      description: `User ${userId} definitief verwijderd`,
      status: 'success'
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE ERROR:", err.message); // <--- Kijk hiernaar in je terminal!
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}