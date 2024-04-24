pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile-deploy'
            reuseNode true
        }
    }

    options {
        quietPeriod(0)
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage("Deploy main") {
            when {
                branch 'main'
            }
            environment {
                deploy_env = "dev"
            }
            stages {
                stage("Install dependencies") {
                    steps {
                        script {
                            sh """
                                pnpm install 
                            """
                        }
                    }
                }
                stage ("Wrangler deploy bff") {
                    steps {
                        withCredentials([
                            usernamePassword(credentialsId: 'cf-workers-creds', usernameVariable: 'CLOUDFLARE_ACCOUNT_ID', passwordVariable: 'CLOUDFLARE_API_TOKEN'),
                        ]) {
                            sh """
                                npx wrangler deploy --config apps/blog-bff/wrangler.toml --env "$deploy_env"
                            """   
                        }
                    }
                }
            }
        }

    }
}
