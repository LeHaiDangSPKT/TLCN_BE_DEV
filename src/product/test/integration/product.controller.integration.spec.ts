import { Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import * as request from 'supertest';
import { AppModule } from "../../../app.module"
import { DatabaseService } from "../../../database/database.service";
import { productStub } from "../stubs/product.stub";
import { JwtATAuthGuard } from "src/auth/guards/jwt-at-auth.guard";
import { ProductModule } from "src/product/product.module";

describe('ProductController', () => {
    let dbConnection: Connection;
    let httpServer: any;
    let app: any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ProductModule]
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        httpServer = app.getHttpServer();
    })

    afterAll(async () => {
        await app.close();
    })

    beforeEach(async () => {
        await dbConnection.collection('products').deleteMany({});
    })

    describe('getAllBySearchPublic', () => {
        it('Should return an array of products', async () => {
            await dbConnection.collection('products').insertOne(productStub())
            const response = await request(httpServer).get('?page=1&limit=5');

            expect(response.status).toBe(200);
            expect(response.body.data.metadata.data.total).toEqual(1);
        })
    })

    //   describe('createUser', () => {
    //     it('should create a user', async () => {
    //       const createUserRequest: CreateUserRequest = {
    //         email: userStub().email,
    //         age: userStub().age
    //       }
    //       const response = await request(httpServer).post('/users').send(createUserRequest)

    //       expect(response.status).toBe(201);
    //       expect(response.body).toMatchObject(createUserRequest);

    //       const user = await dbConnection.collection('users').findOne({ email: createUserRequest.email });
    //       expect(user).toMatchObject(createUserRequest);
    //     })
    //   })
})