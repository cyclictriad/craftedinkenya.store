import moment  from 'moment'

export const formatDate = function(date){
 const now = moment()
 date = moment(date)
 const diffInDays = now.diff(date, 'days');
 if(diffInDays < 7){
    return date.fromNow()
 }else{
    return date.format('MMMM D, YYYY')
 }
}