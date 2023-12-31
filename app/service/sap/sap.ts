import getBearerToken from "./getBearerToken"

export interface Notification {
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
  Latitude: null | string;
  Longitude: null | string;
}

interface NotificationResponse {
  "@odata.context": string;
  value: Notification[];
}


export default async function getSapData(id: string) {
  const bearerToken = await getBearerToken()
  const url = `${process.env.NOTIFICATIONS_SRV_HOST}/odata/v4/notifications/Headers?$filter=EquipmentNumber eq '${id}'`
  const data = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + bearerToken
    }
  })

  const json: NotificationResponse = await data.json()
  return json.value[0]
}