#!/bin/sh -e
awslocal s3 mb s3://mysic-dev
awslocal ses verify-email-identity --email-address test@mysic.id