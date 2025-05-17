import beachImage from '../assets/mood_images/beach.jpg';

// URL gambar dari internet yang mewakili berbagai mood/situasi
const moodImages = [
  {
    id: 'beach',
    name: 'Beachside Tranquility',
    description: 'Relaxing by the ocean with gentle waves',
    imageUrl: beachImage,
    scentAssociations: {
      'Atlantis': 5,
      'Garden Breeze': 4,
      'Feeling Good': 2,
      'Shelby': 1,
      'Utopia': 3,
      '1970': 1,
      'Royal': 2,
      'Revolt': 1
    }
  },
  {
    id: 'forest',
    name: 'Forest Adventure',
    description: 'Exploring the deep woods with fresh air',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    scentAssociations: {
      'Atlantis': 2,
      'Garden Breeze': 5,
      'Feeling Good': 3,
      'Shelby': 2,
      'Utopia': 4,
      '1970': 1,
      'Royal': 3,
      'Revolt': 1
    }
  },
  {
    id: 'city_night',
    name: 'City Night Lights',
    description: 'Urban energy under the glow of city lights',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    scentAssociations: {
      'Atlantis': 1,
      'Garden Breeze': 1,
      'Feeling Good': 2,
      'Shelby': 3,
      'Utopia': 2,
      '1970': 5,
      'Royal': 4,
      'Revolt': 5
    }
  },
  {
    id: 'cozy_home',
    name: 'Cozy Home',
    description: 'Comfortable and warm indoor atmosphere',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    scentAssociations: {
      'Atlantis': 1,
      'Garden Breeze': 2,
      'Feeling Good': 5,
      'Shelby': 3,
      'Utopia': 5,
      '1970': 2,
      'Royal': 4,
      'Revolt': 1
    }
  },
  {
    id: 'elegant_party',
    name: 'Elegant Party',
    description: 'Sophisticated gathering with style and glamour',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    scentAssociations: {
      'Atlantis': 2,
      'Garden Breeze': 1,
      'Feeling Good': 3,
      'Shelby': 4,
      'Utopia': 2,
      '1970': 3,
      'Royal': 5,
      'Revolt': 4
    }
  },
  {
    id: 'rainy_day',
    name: 'Rainy Day',
    description: 'Peaceful moments during rainfall',
    imageUrl: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    scentAssociations: {
      'Atlantis': 4,
      'Garden Breeze': 3,
      'Feeling Good': 3,
      'Shelby': 5,
      'Utopia': 2,
      '1970': 4,
      'Royal': 2,
      'Revolt': 3
    }
  }
];

// Helper untuk admin panel
export const getImageOptionsForAdmin = () => {
  return moodImages.map(img => ({
    id: img.id,
    text: img.name,
    description: img.description,
    imageUrl: img.imageUrl,
    scentMappings: img.scentAssociations
  }));
};

export default moodImages;