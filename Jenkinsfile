pipeline {
    agent any

    environment {
        IMAGE_NAME = "raheesc/todo-devops-demo"
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
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Deploying MySQL + PHP app to Kubernetes...'
                sh '''
                    # Apply MySQL secret
                    kubectl apply -f k8s/mysql-secret.yaml

                    # Apply MySQL deployment & service
                    kubectl apply -f k8s/mysql.yaml

                    # Apply PHP deployment & service
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build and deployment completed successfully! Image: $IMAGE_NAME:$IMAGE_TAG"
        }
        failure {
            echo "❌ Build failed. Check logs above."
        }
    }
}
