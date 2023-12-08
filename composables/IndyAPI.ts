import axios from "axios";
import {type DiplomaSchema } from "~/composables/VerifiableCredential";
export async function createConnection (connectionUserName: string): Promise<string> {
  console.log('Creating connection...');
  console.log(connectionUserName)
  // const {data, status} = await axios.post(
  //   'http://eid-admin.c4dt.org/connections/create-invitation?auto_accept=true',
  //   {
  //     "my_label": "student: " + connectionUserName
  //   },
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-API-KEY': 'NVRGbAQdIPGBritg3TzDYhpAu'
  //     }
  //   })
  // console.log(data);
  // console.log(status);
  return "https://www.npmjs.com/package/qrcode.vue"
}

export const GenerateVC = async (connectionID: string, credentialData: DiplomaSchema) => {
  console.log('Generating Verifiable Credential...');
  axios.post('http://eid-admin.c4dt.org/issue-credential/send', {
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
            "value": "Ahmed Elghareeb",
            "name": credentialData.signee,
            "mime-type": "text/plain"
          },
          {
            "value": "2018-05-12",
            "name": credentialData.dateOfIssue,
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
}