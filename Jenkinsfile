
pipeline {
  agent any
  stages {
    stage('Install backend') {
      steps {
        dir(path: 'backend') {
          nodejs('Node 16') {
            sh 'npm i'
          }
        }
      }
    }

    stage('Install frontend') {
      steps {
        dir(path: 'client') {
          nodejs('Node 16') {
            sh 'npm i'
          }
        }
      }
    }

    stage('Build backend') {
      steps {
        dir(path: 'backend') {
          nodejs('Node 16') {
            sh 'npm run build'
          }
        }
      }
    }

    stage('Build frontend') {
      steps {
        dir(path: 'frontend') {
          nodejs('Node 16') {
            sh 'npm run build'
          }
        }
      }
    }

    stage('Test backend') {
      steps {
        dir(path: 'backend') {
          nodejs('Node 16') {
            sh 'npm run test'
          }
        }
      }
    }


    stage('Clean up') {
      steps {
        cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true)
      }
    }
  }
}
