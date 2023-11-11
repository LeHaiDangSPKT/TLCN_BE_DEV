import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";
import { SWAGGER_CONFIG } from "./swagger.config";


export function createDocument(app: INestApplication): OpenAPIObject{
    const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'Authorization')
    for(const tag of SWAGGER_CONFIG.tags){
        builder.addTag(tag)
    }
    const option: SwaggerDocumentOptions = {
        operationIdFactory: (
          controllerKey: string,
          methodKey: string
        ) => methodKey
      };
    const builds = builder.build()
    return SwaggerModule.createDocument(app, builds, option)
}