pipeline {
    agent any

    environment {
        IMAGE_NAME = "rahees84/todo-devops-demo"
        IMAGE_TAG  = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Pulling latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/rahees84/todo-devops-demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Push to Docker Hub') {
        steps {
            echo '🚀 Pushing image to Docker Hub...'
            withCredentials([usernamePassword(
                credentialsId: 'docker-hub-creds',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {
                sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push raheesc/todo-devops-demo:latest
                    docker logout
                '''
            }
        }
    }

    }

    post {
        success {
            echo "✅ Build completed successfully! Image: $IMAGE_NAME:$IMAGE_TAG"
        }
        failure {
            echo "❌ Build failed. Check logs above."
        }
    }
}
