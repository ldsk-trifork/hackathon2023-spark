import getBearerToken from "./getBearerToken"

interface Notification {
  NotificationNumber: string;
  OrderNumber: string;
  NotificationType: string;
  Description: string;
  Priority: string;
  NotificationDate: null | Date;
  NotificationTime: null | Date;
  ReportedBy: string;
  CatalogProfile: string;
  CatalogType: string;
  CodeGroup: string;
  Coding: string;
  CompletionDate: null | Date;
  DeleteFlag: string;
  Phase: string;
  ObjectNumber: string;
  RequiredEndDate: null | Date;
  SerialNumber: string;
  Material: string;
  FunctionalLocation: null | string;
  EquipmentNumber: string;
}

interface NotificationResponse {
  "@odata.context": string;
  value: Notification[];
}


export default async function getSapData(id: string) {
  const { access_token } = await getBearerToken()
  const url = `https://invokerscf-hack23-team3-s4-notifications-srv.cfapps.eu10.hana.ondemand.com/odata/v4/notifications/Headers?$filter=EquipmentNumber eq '${id}'`
  const data = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  })

  const json: NotificationResponse = await data.json()
  return json.value[0]
}