export const greetings = [
  "Hello Doctor! 👨‍⚕️ | नमस्ते डॉक्टर!",
  "Welcome Back! 🎉 | आपका स्वागत है!",
  "Have a great day! 🌸 | आपका दिन शुभ हो!",
  "Ready to heal lives ❤️ | जीवन को स्वस्थ करने के लिए तैयार!",
  "Stay positive ✨",
  "Aapka din mangalmay ho! 🌸",
  "Patients ke liye aap ek hero hain! 🦸‍♂️",
  "Chaliye aaj zindagi bachate hain ❤️",
  "Keep spreading smiles 😃",
  "Aapki mehnat se log swasth bante hain 🙏",
  "Stay positive, heal better ✨",
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