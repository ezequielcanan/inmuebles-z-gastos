export const formatNumber = (num = 0) => {
  return Number((num || 0).toFixed(2)).toLocaleString("ar")
}