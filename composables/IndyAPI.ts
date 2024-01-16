import axios from "axios";
import {type DiplomaSchema } from "~/composables/VerifiableCredential";

export async function createConnection (isIssuer: boolean): Promise<{ invitationURL: string; connectionID: string}> {
  let connectorName, connectionDomain, connectionAPIKey: string
  if (isIssuer) {
    connectorName = 'EPFL';
    connectionDomain = process.env.ISSUER_URL;
    connectionAPIKey = process.env.ISSUER_API_KEY;
  } else {
    connectorName = 'Leo Inc.';
    connectionDomain = process.env.VERIFIER_URL;
    connectionDomain = process.env.VERIFIER_API_KEY;
  }
  const {data} = await axios.post(
    `${connectionDomain}/connections/create-invitation?auto_accept=true`,
    {
      "my_label": connectorName
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': connectionAPIKey
      }
    })
  return {invitationURL: data.invitation_url, connectionID: data.connection_id};
}

export async function checkInvitationIsAccepted (connectionID: string, isIssuer: boolean): Promise<boolean> {
  let connectionDomain, connectionAPIKey: string
  if (isIssuer) {
    connectionDomain = process.env.ISSUER_URL;
    connectionAPIKey = process.env.ISSUER_API_KEY;
  } else {
    connectionDomain = process.env.VERIFIER_URL;
    connectionDomain = process.env.VERIFIER_API_KEY;
  }
  console.log('Checking invitation is accepted...');
  const {data} = await axios.get(
    `${connectionDomain}/connections/${connectionID}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': connectionAPIKey
      }
    })
  return data.state === 'active';
}

export const GenerateVC = async (connectionID: string, credentialData: DiplomaSchema) => {
  console.log('Generating Verifiable Credential');
  const {data} = await axios.post(`${process.env.ISSUER_URL}/issue-credential/send`, {
      "connection_id": connectionID,
      "credential_proposal": {
        "attributes": [
          {
            "name": "subject",
            "value": credentialData.subject,
            "mime-type": "text/plain"
          },
          {
            "name": "degree",
            "value": credentialData.degree,
            "mime-type": "text/plain"
          },
          {
            "name": "document_number",
            "value": credentialData.documentNumber,
            "mime-type": "text/plain"
          },
          {
            "name": "body",
            "value": credentialData.body,
            "mime-type": "text/plain"
          },
          {
            "name": "signee",
            "value": credentialData.signee,
            "mime-type": "text/plain"
          },
          {
            "name": "date_of_issue",
            "value": credentialData.dateOfIssue,
            "mime-type": "text/plain"
          }
        ],
        "@type": "issue-credential/1.0/credential-preview"
      },
      "auto_remove": "true",
      "schema_id": "JEfsRZ6qBhToWbGcJDfe2N:2:EPFL_diploma_supplement:1.0.7"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.ISSUER_API_KEY
      }
    })
  console.log(data);
  return
}

export async function sendProofRequest (connectionID: string): Promise<void> {
  console.log('Sending proof request');
  const {data} = await axios.post(
    `${process.env.VERIFIER_URL}/present-proof/send-request`,
    {
      "connection_id": connectionID,
      "auto_remove": false,
      "auto_verify": true,
      "proof_request": {
        "name": "Diploma proof request",
        "nonce": "1234567890",
        "requested_predicates": {},
        "requested_attributes": {
          "info": {
            "names": [
              "subject",
              "degree",
              "document_number",
            ],
            "restrictions": [
              {
                "schema_name": "EPFL_diploma_supplement",
                "schema_version": "1.0.7",
                "issuer_did": "JEfsRZ6qBhToWbGcJDfe2N"
              }
            ]
          }
        },
        "version": "1.0"
      },
      "trace": "true"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.VERIFIER_API_KEY
      }
    })
  return data
}

export async function checkProofRequestIsAccepted (proofRequestID: string): Promise<boolean> {
  console.log('Checking proof request is accepted...');
  let {data} = await axios.get(
    `${process.env.VERIFIER_URL}/present-proof/records/${proofRequestID}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.VERIFIER_API_KEY
      }
    })
  let accepted = data.state === 'verified';
  if (accepted) {
    data = {
      subject: data.presentation.requested_proof.revealed_attr_groups.info.values.subject.raw,
      degree: data.presentation.requested_proof.revealed_attr_groups.info.values.degree.raw,
      documentNumber: data.presentation.requested_proof.revealed_attr_groups.info.values.document_number.raw,}
  }
  return {isAccepted: accepted, data: data};
}