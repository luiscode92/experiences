#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkDashboardStack } = require('../lib/cdk-dashboard-stack');

const app = new cdk.App();
new CdkDashboardStack(app, 'CdkDashboardStack');
