const { JWT, JWK } = require(`jose`)
const sinon = require(`sinon`)
const Auth = require(`../src`)
const test = require(`tape`)

const TEST_PUB_KEY = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyPFkF/uh+7n0l9Sj4S2LGCvao0roJOj8FoZu8/pbgbG4/PiPsR6EUxThFXR97v8ALLHUPBh5jntCXt3R+ok0hA==`

const TODOIST_WRITE_JWT = `eyJraWQiOiJxOENYSkpPTm5sR1lZVTE3M3lNRXBieFI3X1BHelBkR2hvQ3M1dVI3RGp3IiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiJ3YXRjaGVycyIsImlzcyI6Imh0dHBzOi8vcW56bC5jbyIsImNsYWltcyI6WyJ0b2RvaXN0OndyaXRlIl0sImlhdCI6MTYxMjEyODA5OH0.vfx71mI5j_cs4ZRWXnwRJvSmF1kaybT3lgI8XWw0InrKDaQBWFvZpYgOBoAofL_vHvp8kUwicqUYbgaIrm4Vhg`

const TODOIST_READ_JWT = `eyJraWQiOiJxOENYSkpPTm5sR1lZVTE3M3lNRXBieFI3X1BHelBkR2hvQ3M1dVI3RGp3IiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiJ3YXRjaGVycyIsImlzcyI6Imh0dHBzOi8vcW56bC5jbyIsImNsYWltcyI6WyJ0b2RvaXN0OnJlYWQiXSwiaWF0IjoxNjEyMTI4NDc5fQ.VFRKHIlazcTZyy68h7CuPQHMcYylFiA3yt5b9moXm8djRe-j82WI4py2TWUXOwv-zdImz3ozUHbIWaGuEn2HoA`

const TODOIST_WILDCARD_JWT = `eyJraWQiOiJxOENYSkpPTm5sR1lZVTE3M3lNRXBieFI3X1BHelBkR2hvQ3M1dVI3RGp3IiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiJ3YXRjaGVycyIsImlzcyI6Imh0dHBzOi8vcW56bC5jbyIsImNsYWltcyI6WyJ0b2RvaXN0OioiXSwiaWF0IjoxNjEyMTI4NDkyfQ.8ovc05QkARE6-vRR0qilLftpnrsRFEm6nPALs3Qf1xYJENGlQCuCqtC2o1TckDO4vpszFyQ_zOnqORujr6t39g`

const ALL_CLAIMS_JWT = `eyJraWQiOiJxOENYSkpPTm5sR1lZVTE3M3lNRXBieFI3X1BHelBkR2hvQ3M1dVI3RGp3IiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiJ3YXRjaGVycyIsImlzcyI6Imh0dHBzOi8vcW56bC5jbyIsImNsYWltcyI6WyIqIl0sImlhdCI6MTYxMjEyODUwNX0.8Z13Vroc3XnNpGQstvcOHdKiiQzs0VSrSMu2cB0hr9hd8fk6IN3TQtvWfUE8OTbkcJmEjTPwKcSxqxcFBS2Lkw`

test(`class instantiation`, (t) => {
  t.test(`class instantiation - no public key`, (_t) => {
    _t.plan(1)

    try {
      const auth = new Auth()

      _t.fail(`didn't throw an error when no public key was passed`)
    } catch (error) {
      _t.ok(error, `throws an error if public key isn't passed`)
    }
  })

  t.test(`class instantiation`, (_t) => {
    _t.plan(2)

    const jwtAsKeyStub = sinon.stub(JWK, `asKey`).returns(`123`)

    const auth = new Auth(`456`)

    _t.ok(jwtAsKeyStub.calledOnce, `JWK.asKey has been called`)
    _t.equal(auth.publicKey, `123`, `sets public key from JWK.asKey`)

    jwtAsKeyStub.restore()
  })
})

test(`jwt claim tests`, (t) => {
  const auth = new Auth(TEST_PUB_KEY)

  t.test(`failing jwt`, (_t) => {
    _t.plan(1)

    const isPassing = auth.check(TODOIST_WRITE_JWT, {
      desiredClaim: `todoist:read`,
      subject: `watchers`,
      issuer: `https://qnzl.co`,
    })

    _t.notOk(isPassing, `should not pass JWT without proper claims`)
  })

  t.test(`passing jwt`, (_t) => {
    _t.plan(1)

    const isPassing = auth.check(TODOIST_READ_JWT, {
      desiredClaim: `todoist:read`,
      subject: `watchers`,
      issuer: `https://qnzl.co`,
    })

    _t.ok(isPassing, `should pass JWT with proper claims`)
  })

  t.test(`passing global wildcard jwt`, (_t) => {
    _t.plan(1)

    const isPassing = auth.check(ALL_CLAIMS_JWT, {
      desiredClaim: `todoist:read`,
      subject: `watchers`,
      issuer: `https://qnzl.co`,
    })

    _t.ok(isPassing, `should pass JWT with global wildcard claim`)
  })

  t.test(`passing service-level wildcard jwt`, (_t) => {
    _t.plan(1)

    const isPassing = auth.check(TODOIST_WILDCARD_JWT, {
      desiredClaim: `todoist:read`,
      subject: `watchers`,
      issuer: `https://qnzl.co`,
    })

    _t.ok(isPassing, `should pass JWT with service-level wildcard claim`)
  })
})
