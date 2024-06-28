# Rest Project + TypeScript

No ejecución


## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Llenar la base de datos con `npm run seed`. Solo en desarrollo. Nunca en producción.
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo.
    - ngrok http http://localhost:3000 para ejecutar validador

