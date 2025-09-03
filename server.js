import jsonServer from 'json-server'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  const db = router.db
  const user = db.get('users').find({ username, password }).value()
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const { password: _, ...safe } = user
  res.json(safe)
})

server.use(router)

const PORT = 4000
server.listen(PORT, () => console.log('Mock API at http://localhost:' + PORT))
