const { JWT, JWK } = require(`jose`)

class Auth {
  /**
   * Create new instance of Auth
   *
   * @param {string} jwtPublicKey Raw public key
   */
  constructor(jwtPublicKey) {
    if (!jwtPublicKey) {
      throw new Error(`must pass public key as parameter to Auth`)
    }

    const pemFile = `
-----BEGIN PUBLIC KEY-----
${jwtPublicKey}
-----END PUBLIC KEY-----`

    this.publicKey = JWK.asKey(pemFile.trim())
  }

  /**
   * Check a JWT has the required claim
   *
   * @param {string} jwt JWT to check
   * @param {object} opts
   * @param {string} opts.desiredClaim Dot-separated claim we are looking for
   * @param {string} opts.subject Scoping a JWT claim to a specific project
   * @param {string} opts.issuer Scoping a JWT claim to a specific issuer
   */
  check(jwt, { desiredClaim, subject, issuer }) {
    if (!jwt || !desiredClaim) {
      throw new Error(`must pass \`jwt\` and \`desiredClaim\``)
    }

    let decodedToken
    try {
      decodedToken = JWT.verify(jwt, this.publicKey, {
        subject,
        issuer,
      })
    } catch (error) {
      console.error(`error due to invalid token`, error)

      return false
    }

    const hasValidClaim = decodedToken.claims.some((tokenClaim) => {
      // "*" claim is all access
      if (tokenClaim === `*`) return true

      if (tokenClaim === desiredClaim) return true

      // Wildcard is valid as last position, to allow all claims below that level
      // For instance, `trello.*` will give all access to all Trello data
      if (tokenClaim.includes(`*`)) {
        const tokenClaimParts = tokenClaim.split(`:`).slice(0, -1)
        const desiredClaimParts = desiredClaim.split(`:`)

        return tokenClaimParts.every((claimPart, index) => {
          return desiredClaimParts[index] === claimPart
        })
      }
    })

    return hasValidClaim
  }
}

module.exports = Auth
