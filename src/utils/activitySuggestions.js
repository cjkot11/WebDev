/**
 * Activity Suggestions (Sophia - Feature 6)
 * Maps mood types to appropriate activity suggestions
 */

/**
 * Get activity suggestions based on mood type
 * @param {string} mood - The mood type (ecstatic, happy, content, neutral, anxious, sad, frustrated)
 * @returns {Array} Array of activity objects with title, description, and category
 * List of activities done with the help of AI for the description and category 
 */
export function getActivitiesForMood(mood) {
  const moodLower = mood ? mood.toLowerCase() : 'neutral';
  
  const activityMap = {
    ecstatic: [
      {
        title: "Share Your Joy",
        description: "Call a friend or family member to share your positive energy. Your happiness can be contagious!",
        category: "Social",
        icon: "💬"
      },
      {
        title: "Creative Expression",
        description: "Channel your high energy into a creative project - paint, write, dance, or make music.",
        category: "Creative",
        icon: "🎨"
      },
      {
        title: "Physical Activity",
        description: "Go for a run, do yoga, or hit the gym. Use this energy boost for your body!",
        category: "Physical",
        icon: "🏃"
      },
      {
        title: "Plan Something Special",
        description: "Use this positive momentum to plan a celebration or special event you've been wanting to do.",
        category: "Planning",
        icon: "📅"
      },
      {
        title: "Practice Gratitude",
        description: "Write down what made you feel this way. Documenting positive moments helps them last longer.",
        category: "Mindfulness",
        icon: "🙏"
      }
    ],
    happy: [
      {
        title: "Connect with Loved Ones",
        description: "Reach out to someone you care about. Share your good mood and strengthen your relationships.",
        category: "Social",
        icon: "👥"
      },
      {
        title: "Enjoy Nature",
        description: "Take a walk in a park, visit a garden, or simply sit outside and appreciate the beauty around you.",
        category: "Nature",
        icon: "🌳"
      },
      {
        title: "Do Something You Love",
        description: "Engage in a hobby or activity that brings you joy - reading, cooking, music, or crafts.",
        category: "Hobby",
        icon: "❤️"
      },
      {
        title: "Help Someone",
        description: "Volunteer or do a kind act for someone else. Spreading happiness multiplies it.",
        category: "Service",
        icon: "🤝"
      },
      {
        title: "Celebrate Small Wins",
        description: "Acknowledge what's going well in your life. Take time to appreciate your achievements.",
        category: "Reflection",
        icon: "🎉"
      }
    ],
    content: [
      {
        title: "Mindful Meditation",
        description: "Practice 10-15 minutes of meditation to maintain your peaceful state of mind.",
        category: "Mindfulness",
        icon: "🧘"
      },
      {
        title: "Gentle Exercise",
        description: "Go for a leisurely walk, do some stretching, or try a gentle yoga session.",
        category: "Physical",
        icon: "🚶"
      },
      {
        title: "Read a Book",
        description: "Enjoy a good book or listen to an audiobook. Let yourself get lost in a story.",
        category: "Relaxation",
        icon: "📚"
      },
      {
        title: "Maintain Balance",
        description: "Continue doing what's working for you. Keep up healthy routines and habits.",
        category: "Wellness",
        icon: "⚖️"
      },
      {
        title: "Journal Your Thoughts",
        description: "Write about what's contributing to your contentment. Understanding helps maintain it.",
        category: "Reflection",
        icon: "✍️"
      }
    ],
    neutral: [
      {
        title: "Try Something New",
        description: "Explore a new hobby, recipe, or activity. Novel experiences can spark interest and energy.",
        category: "Exploration",
        icon: "🔍"
      },
      {
        title: "Organize Your Space",
        description: "Tidy up a room or organize something. A clean space can help create mental clarity.",
        category: "Productivity",
        icon: "📦"
      },
      {
        title: "Listen to Music",
        description: "Put on some music that matches or shifts your mood. Music can be a powerful mood regulator.",
        category: "Entertainment",
        icon: "🎵"
      },
      {
        title: "Light Exercise",
        description: "Do some light physical activity - even a 15-minute walk can boost your energy and mood.",
        category: "Physical",
        icon: "🚶"
      },
      {
        title: "Reach Out to Someone",
        description: "Text or call a friend. Social connection can help shift your mood in a positive direction.",
        category: "Social",
        icon: "💬"
      }
    ],
    anxious: [
      {
        title: "Deep Breathing Exercise",
        description: "Practice 4-7-8 breathing: inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
        category: "Calming",
        icon: "🫁"
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Tense and release each muscle group from toes to head. This helps release physical tension.",
        category: "Relaxation",
        icon: "💆"
      },
      {
        title: "Grounding Technique (5-4-3-2-1)",
        description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you to the present.",
        category: "Mindfulness",
        icon: "🌍"
      },
      {
        title: "Gentle Movement",
        description: "Do some gentle stretching or yoga. Physical movement can help release anxious energy.",
        category: "Physical",
        icon: "🧘"
      },
      {
        title: "Write Down Your Worries",
        description: "Put your anxious thoughts on paper. This can help you process and let go of them.",
        category: "Reflection",
        icon: "📝"
      }
    ],
    sad: [
      {
        title: "Get Some Sunlight",
        description: "Spend time outside or near a window. Natural light can help boost your mood and energy.",
        category: "Wellness",
        icon: "☀️"
      },
      {
        title: "Listen to Uplifting Music",
        description: "Create a playlist of songs that make you feel better. Music can be a powerful mood lifter.",
        category: "Entertainment",
        icon: "🎵"
      },
      {
        title: "Reach Out for Support",
        description: "Talk to a trusted friend, family member, or therapist. You don't have to go through this alone.",
        category: "Social",
        icon: "🤗"
      },
      {
        title: "Light Physical Activity",
        description: "Go for a walk, do some gentle stretching, or dance to your favorite song. Movement helps.",
        category: "Physical",
        icon: "🚶"
      },
      {
        title: "Practice Self-Compassion",
        description: "Be kind to yourself. Remind yourself that it's okay to feel sad sometimes. This too shall pass.",
        category: "Mindfulness",
        icon: "💙"
      }
    ],
    frustrated: [
      {
        title: "Physical Release",
        description: "Go for a run, hit a punching bag, or do a high-intensity workout. Physical activity can release tension.",
        category: "Physical",
        icon: "💪"
      },
      {
        title: "Take a Break",
        description: "Step away from what's frustrating you. Take a 10-minute break to reset and clear your mind.",
        category: "Self-Care",
        icon: "⏸️"
      },
      {
        title: "Express Your Feelings",
        description: "Write in a journal, talk to someone, or express yourself creatively. Getting it out helps.",
        category: "Expression",
        icon: "💭"
      },
      {
        title: "Problem-Solving Session",
        description: "Write down what's frustrating you and brainstorm solutions. Taking action can reduce frustration.",
        category: "Productivity",
        icon: "🔧"
      },
      {
        title: "Calming Activity",
        description: "Do something soothing - take a warm bath, listen to calming music, or practice deep breathing.",
        category: "Relaxation",
        icon: "🛁"
      }
    ]
  };

  //return activities for the mood, or default to neutral if mood not found
  return activityMap[moodLower] || activityMap.neutral;
}

/**
 * Get a random subset of activities (3-5 activities)
 * @param {string} mood - The mood type
 * @param {number} count - Number of activities to return (default: 4)
 * @returns {Array} Array of activity objects
 */
export function getRandomActivitiesForMood(mood, count = 4) {
  const allActivities = getActivitiesForMood(mood);
  
  //shuffle array and return requested count
  const shuffled = [...allActivities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allActivities.length));
}

