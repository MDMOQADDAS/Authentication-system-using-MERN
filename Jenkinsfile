pipeline{
    agent any

    stages{
        stage("SCM"){
            steps{
                git 'https://github.com/MDMOQADDAS/Authentication-system-using-MERN.git'
            }
        }

        stage("Build"){
            steps{
                sh 'docker build -t basicapp:${BUILD_NUMBER} .'
            }
        }

        stage("Test"){
            steps{
                if(docker ps myapp || date ){
                    docker rm -f myapp
                }
                sh 'docker run -d --name myapp basicapp:${BUILD_NUMBER}'
            }
        }

        stage("Push to the centralized repositery"){
            steps{
                echo "pushing to the centralized repositry"
            }
        }


        
    }
}