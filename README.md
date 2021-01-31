## @qnzl/auth

Drop-in JWT authentication against specific claims (`todoist.read.all`) for a specific project / subject and issuer, to limit scope of keys

### Installation

```
npm install --save @qnzl/auth
```

### Usage

```javascript
const Auth = require(`@qnzl/auth`)

const jwtPublicKey = `<public key>`

const auth = new Auth(jwtPublicKey)

// JWT has claim of `*`
const jwtToCheck = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjbGFpbXMiOlsiKiJdfQ.N9BGQcYOrjGnWXGWQlH9Gi-O_SL6kQrVd5n1QnlMOz0`

const hasClaim = auth.check(jwtToCheck, `todoist:read.*`, {
  issuer: `https://google.com`,
  subject: `watchers`,
})

console.log(`has 'todoist.read' claim: ${hasClaim}`)
```
