pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "raheesc/todo-devops-demo"
        FRONTEND_IMAGE = "raheesc/todo-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Pulling latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/rahees84/todo-devops-demo.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "🐳 Building backend Docker image..."
                sh 'docker build -t $BACKEND_IMAGE:$IMAGE_TAG .'
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "🎨 Building frontend Docker image..."
                sh 'docker build -t $FRONTEND_IMAGE:$IMAGE_TAG ./frontend'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo '🚀 Pushing both images to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $BACKEND_IMAGE:$IMAGE_TAG
                        docker push $FRONTEND_IMAGE:$IMAGE_TAG
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Deploying to Kubernetes...'
                sh '''
                    kubectl apply -f k8s/mysql-storage.yaml || true
                    kubectl apply -f k8s/mysql-secret.yaml || true
                    kubectl create configmap mysql-initdb-config --from-file=sql/init.sql -o yaml --dry-run=client | kubectl apply -f -

                    kubectl apply -f k8s/mysql-deployment.yaml
                    kubectl apply -f k8s/backend.yaml
                    kubectl apply -f k8s/frontend.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build and deployment completed successfully!"
        }
        failure {
            echo "❌ Build failed. Check logs above."
        }
    }
}
