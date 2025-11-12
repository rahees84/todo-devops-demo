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
        echo '🚀 Deploying to Kubernetes...'
        sh '''
            # Apply storage, secrets & configmap first
            kubectl apply -f k8s/mysql-storage.yaml || true
            kubectl apply -f k8s/mysql-secret.yaml || true
            kubectl apply -f k8s/mysql-configmap.yaml || true

            # Deploy MySQL database
            kubectl apply -f k8s/mysql-deployment.yaml

            # Wait until MySQL pod is ready (max 2 minutes)
            echo "⏳ Waiting for MySQL to be ready..."
            kubectl rollout status statefulset/mysql --timeout=120s || true

            # Deploy backend and frontend apps
            kubectl apply -f k8s/backend.yaml
            kubectl apply -f k8s/frontend.yaml

            echo "✅ Deployment completed successfully!"
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
