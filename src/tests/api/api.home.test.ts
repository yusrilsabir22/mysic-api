import request from 'supertest'

import { Server } from "../../server";

let server: Server
let homeContinuation: string
let homeNext: string

beforeAll(async () => {
    const s = new Server(false)
    await s.start()
    server = s
})

describe('GET /Home', () => {
  it('should return 200 & valid response', (done) => {
    request(server.app)
      .get(`/api/v1/home`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toHaveProperty("continuation")
        homeContinuation = res.body.continuation
        done()
      })
  })
})

describe('GET /Browse home continuation', () => {
  it('should return 200 & valid response if request param continuation is provided', (done) => {
    request(server.app)
      .get(`/api/v1/browse?ct=${homeContinuation}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toHaveProperty("data")
        for(const ctn of res.body.data) {
          if(ctn.type != "browse") continue
          homeNext = ctn.contents[0].browseId
          break
        }
        done()
      })
  })
})

describe('GET /Browse home next -> playlist song', () => {
  it('should return 200 & valid response if request param next is provided', (done) => {
    request(server.app)
      .get(`/api/v1/browse?next=${homeNext}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toHaveProperty("contents")
        done()
      })
  })
})

afterAll(async () => {
  await server.stop()
})