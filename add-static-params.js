const fs = require('fs');
const path = require('path');

// Fonction pour ajouter generateStaticParams aux fichiers page.tsx
function addGenerateStaticParams(filePath) {
  try {
    // Lire le contenu du fichier
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si la fonction existe déjà
    if (content.includes('export function generateStaticParams')) {
      console.log(`La fonction existe déjà dans ${filePath}`);
      return;
    }
    
    // Déterminer le type de page
    const isPropertyIdPage = filePath.includes('property/[id]');
    const isConfirmationIdPage = filePath.includes('reservation/confirmation/[id]');
    
    // Préparer le code à insérer
    let codeToInsert;
    
    if (isPropertyIdPage || isConfirmationIdPage) {
      // Pour les pages avec paramètre ID
      codeToInsert = `
// Cette fonction est requise pour la génération statique avec des routes dynamiques
export async function generateStaticParams() {
  // Vous pouvez récupérer les IDs depuis votre API
  // Pour l'exemple, nous utilisons des IDs statiques
  const ids = ['1', '2', '3']; // Remplacez par vos IDs réels
  
  const langs = ['fr', 'en', 'de'];
  
  return langs.flatMap(lang => 
    ids.map(id => ({
      lang,
      id
    }))
  );
}
`;
    } else {
      // Pour les pages avec seulement le paramètre de langue
      codeToInsert = `
// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  // Définir les chemins de langue à pré-rendre
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}
`;
    }
    
    // Trouver l'endroit où insérer le code (après les imports)
    const importEndIndex = Math.max(
      content.lastIndexOf('import') > -1 ? 
        content.indexOf(';', content.lastIndexOf('import')) + 1 : 0,
      content.lastIndexOf('from') > -1 ? 
        content.indexOf(';', content.lastIndexOf('from')) + 1 : 0
    );
    
    // Si aucun import n'est trouvé, insérer au début du fichier
    const insertIndex = importEndIndex > 0 ? importEndIndex : 0;
    
    // Insérer le code
    const newContent = content.slice(0, insertIndex) + codeToInsert + content.slice(insertIndex);
    
    // Écrire le contenu modifié dans le fichier
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`Fonction ajoutée à ${filePath}`);
  } catch (error) {
    console.error(`Erreur lors du traitement de ${filePath}:`, error);
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Récursion dans les sous-dossiers
      processDirectory(filePath);
    } else if (file === 'page.tsx' && directoryPath.includes('[lang]')) {
      // Traiter uniquement les fichiers page.tsx dans les dossiers avec [lang]
      addGenerateStaticParams(filePath);
    }
  }
}

// Chemin du dossier de l'application
const appDirectory = path.join(__dirname, 'frontend', 'app', '[lang]');

// Lancer le traitement
console.log('Début du traitement...');
processDirectory(appDirectory);
console.log('Traitement terminé.');
