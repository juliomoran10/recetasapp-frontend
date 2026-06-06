export const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Arepas de Queso',
    description: 'Deliciosas arepas venezolanas rellenas de queso fundido.',
    time: '20 min',
    ingredients: ['Harina de maíz', 'Agua', 'Sal', 'Queso rallado'],
    steps: ['Mezclar harina, agua y sal', 'Amasar bien', 'Hacer formas circulares', 'Asar en budare', 'Rellenar con queso'],
  },
  {
    id: '2',
    title: 'Pasta al Pesto',
    description: 'Pasta fresca con salsa pesto casera de albahaca.',
    time: '30 min',
    ingredients: ['Pasta', 'Albahaca', 'Aceite de oliva', 'Ajo', 'Nueces', 'Queso Parmesano'],
    steps: ['Hervir la pasta', 'Licuar albahaca, aceite, ajo y nueces', 'Mezclar la salsa con la pasta', 'Añadir queso'],
  },
  {
    id: '3',
    title: 'Huevos Revueltos',
    description: 'Desayuno rápido y lleno de proteínas.',
    time: '10 min',
    ingredients: ['2 Huevos', 'Sal', 'Mantequilla'],
    steps: ['Batir los huevos con sal', 'Derretir mantequilla en la sartén', 'Cocinar removiendo constantemente'],
  }
];

export const MOCK_GROUPS = [
  { id: '1', name: 'Desayunos', recipeCount: 2 },
  { id: '2', name: 'Almuerzos Italianos', recipeCount: 1 },
  { id: '3', name: 'Cenas Rápidas', recipeCount: 0 },
];