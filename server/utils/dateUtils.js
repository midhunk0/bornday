const getNextBornday=(bornday, today)=>{
    const date=new Date(bornday);
    date.setFullYear(today.getFullYear());

    if(date.getMonth()<today.getMonth() || (date.getMonth()===today.getMonth() && date.getDate()<today.getDate())){
        date.setFullYear(today.getFullYear()+1);
    }
    return date;
}

module.exports={
    getNextBornday
};