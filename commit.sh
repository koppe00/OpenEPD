#!/bin/bash

# Kleuren voor de output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Bezig met voorbereiden van commit voor OpenEPD...${NC}"

# 1. Voeg alle wijzigingen toe
git add .

# 2. Vraag de gebruiker om een commit message
echo -e "${GREEN}Voer je commit message in (bijv. 'feat: apple look en realtime sync gefixt'):${NC}"
read commit_message

# Als er geen bericht is ingevoerd, gebruik een standaardbericht
if [ -z "$commit_message" ]
then
      commit_message="Update OpenEPD: UI verbeteringen en real-time sync"
fi

# 3. Voer de commit uit
git commit -m "$commit_message"

echo -e "${GREEN}✓ Wijzigingen lokaal ge-commmit!${NC}"

# 4. Vraag of de gebruiker ook wil pushen naar GitHub/GitLab
echo -e "${BLUE}Wil je de wijzigingen ook pushen naar de remote repository? (y/n)${NC}"
read push_confirm

if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]
then
    git push
    echo -e "${GREEN}✓ Alles staat nu veilig in de cloud!${NC}"
else
    echo -e "${BLUE}Oké, de wijzigingen staan alleen lokaal opgeslagen.${NC}"
fi