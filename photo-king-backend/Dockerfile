FROM maven:eclipse-temurin AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-alpine-3.21
COPY --from=build /target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]