export const greetings = [
  "Hello Doctor! 👨‍⚕️ ",
  "Welcome Back! 🎉",
  "Have a great day! 🌸",
  "Ready to heal lives ❤️",
  "Stay positive ✨",
  "Aapka din mangalmay ho! 🌸",
  "Patients ke liye aap ek hero hain! 🦸‍♂️",
  "Chaliye aaj zindagi bachate hain ❤️",
  "Keep spreading smiles 😃",
  "Aapki mehnat se log swasth bante hain 🙏",
  "Stay positive, heal better ✨",
  "Let's make a difference today! 🩺",
  "Your dedication is inspiring! ✨",
  "Ready to be a lifesaver? 💪",
  "Time to work your magic, Doctor! 🪄",
  "Another day, another opportunity to heal. 🙏",
  "Healing hands, caring heart. ❤️",
  "Coffee, stethoscope, and a goal to save lives. ☕",
  "Duniya ko aap jaise doctors ki zaroorat hai. 🌍",
  "Healing is an art. You are the artist. 🎨",
  "Your expertise saves lives every day. Keep it up! 💪",
  "Making the world a healthier place, one patient at a time. 🌍",
  "Stay sharp, stay compassionate. 🧠❤️",
  "Aaj ka din aapke naam! Let's do this. 🚀",
  "You've got this, Doc! ✨",
  "Bringing hope and health to many. 🙏"
];

export function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀️ | सुप्रभात!";
  if (hour < 18) return "Good Afternoon 🌞 | नमस्कार!";
  return "Good Evening 🌙 | शुभ संध्या!";
}

// Random greeting (English + Hindi mix)
export function getRandomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];}