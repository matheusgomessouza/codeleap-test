  export const getTimeAgo = (date: Date, currentTime: number) => {
    const minutes = Math.floor((currentTime - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }
