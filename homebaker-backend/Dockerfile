# ==============================================================================
# Step 1: Build the application using Gradle Wrapper
# ==============================================================================
# Change '21' to '17' below if your build.gradle targets Java 17 instead
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy all project files into the build container
COPY . .

# Ensure the Gradle Wrapper script has execute permissions inside Linux
RUN chmod +x gradlew

# Run the production build task
RUN ./gradlew bootJar --no-daemon

# ==============================================================================
# Step 2: Run the application in a lightweight production container
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy only the compiled JAR file from the build stage to keep the image small
COPY --from=build /app/build/libs/*.jar app.jar

# Inform the system that the application uses port 8080
EXPOSE 8080

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
