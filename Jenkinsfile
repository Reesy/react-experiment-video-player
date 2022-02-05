pipeline {
  agent any
  stages {
    stage('Install') {
      parallel {
        stage('Install backend') {
          steps {
            nodejs('Node 16') {
              dir(path: 'backend') {
                sh 'npm i'
              }

            }

          }
        }

        stage('Install frontend') {
          steps {
            nodejs('Node 16') {
              dir(path: 'frontend') {
                sh 'npm i --verbose'
              }

            }

          }
        }

      }
    }

    // stage('Build') {
    //   parallel {
    //     stage('Build backend') {
    //       steps {
    //         dir(path: 'backend') {
    //           nodejs('Node 16') {
    //             sh 'npm run build'
    //           }

    //         }

    //       }
    //     }

    //     stage('Build frontend') {
    //       steps {
    //         dir(path: 'frontend') {
    //           nodejs('Node 16') {
    //             sh 'npm run build'
    //           }

    //         }

    //       }
    //     }

    //   }
    // }

    // stage('Test') {
    //   steps {
    //     dir(path: 'backend') {
    //       nodejs('Node 16') {
    //         sh 'npm run test'
    //       }

    //     }

    //   }
    // }

    stage('Clean up') {
      steps {
        cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true)
      }
    }

  }
}