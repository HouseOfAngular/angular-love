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

    environment {
        KV_DEV = credentials('cf-kv-dev')
        KV_PROD = credentials('cf-kv-prod')
    }

    stages {
        stage("Deploy main") {
            when {
                branch 'main'
            }
            stages {
                stage("Install dependencies") {
                    steps {
                        script {
                            sh """
                                corepack enable && corepack prepare pnpm@10.6.2 --activate
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
                                sed -i "s/<kv_dev_namespace_id>/$KV_DEV/g" apps/blog-bff/wrangler.toml
                                sed -i "s/<kv_prod_namespace_id>/$KV_PROD/g" apps/blog-bff/wrangler.toml
                                npx wrangler deploy --config apps/blog-bff/wrangler.toml --env dev
                                npx wrangler deploy --config apps/blog-bff/wrangler.toml --env prod
                            """
                        }
                    }
                }
            }
        }

    }
}
