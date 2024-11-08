export async function getPreguntes () {
  const response = await fetch('http://localhost:3000/questions')
  const data = await response.json()
  return data
}
