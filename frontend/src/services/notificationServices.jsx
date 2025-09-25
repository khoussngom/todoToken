import serviceHistorique from "./serviceHistorique";

const getNotifications = ()=>
{
    return serviceHistorique.obtenirLogsRecents()
}

export default getNotifications;