angular.module('localActivitiesApp', [])
  .controller('LocalController', function () {
    const vm = this;

    vm.activities = [
      {
        name: "Bharatanatyam (Tamil Nadu)",
        description: "One of the oldest classical dance forms in India, characterized by fixed upper torso, bent legs, and intricate footwork combined with expressive gestures."
      },
      {
        name: "Bihu Dance (Assam)",
        description: "A lively folk dance performed during the Bihu festival, symbolizing joy and prosperity among farmers and villagers."
      },
      {
        name: "Kathakali (Kerala)",
        description: "A classical dance-drama known for its elaborate costumes, colorful makeup, and storytelling through facial expressions and hand gestures."
      },
      {
        name: "Ghoomar (Rajasthan)",
        description: "A traditional folk dance performed by women, involving graceful twirling in colorful ghagras, often seen during festive occasions."
      },
      {
        name: "Chhau Dance (Odisha, Jharkhand, West Bengal)",
        description: "A tribal martial dance featuring masks and dramatic battle sequences, depicting stories from epics like Mahabharata and Ramayana."
      },
      {
        name: "Garba (Gujarat)",
        description: "A circular dance performed during Navratri, symbolizing the cycle of life with rhythmic clapping and twirling."
      }
    ];
  });
