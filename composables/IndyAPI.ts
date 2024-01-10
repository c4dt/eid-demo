import axios from "axios";
import {type DiplomaSchema } from "~/composables/VerifiableCredential";
export async function createConnection (connectionUserName: string): Promise<{ invitationURL: string; connectionID: string}> {
  console.log(`Creating connection...${connectionUserName}`);
  const {data} = await axios.post(
    'http://eid.c4dt.org:8000/connections/create-invitation?auto_accept=true',
    {
      "my_label": "EPFL C4DT"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'
      }
    })
  console.log(data);
  return {invitationURL: data.invitation_url, connectionID: data.connection_id};
}

export const GenerateVC = async (connectionID: string, credentialData: DiplomaSchema) => {
  console.log('Generating Verifiable Credential...');
  const {data} = await axios.post('http://eid.c4dt.org:8000/issue-credential/send', {
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
        'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'  // TODO: Move to .env
      }
    })
  console.log(data);
  return
}

export async function checkInvitationIsAccepted (connectionID: string): Promise<boolean> {
  console.log('Checking invitation is accepted...');
  const {data} = await axios.get(
    `http://eid.c4dt.org:8000/connections/${connectionID}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'
      }
    })
  return data.state === 'active';
}