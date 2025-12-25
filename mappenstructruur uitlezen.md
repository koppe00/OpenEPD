# Script 1: Toon relevante mappenstructuur (tot 39 niveaus diep)
find . -maxdepth 9 -not -path '*/.*' -not -path '*/node_modules*' -not -path '*/.next*' 
-not -path '*/dist*' | sort