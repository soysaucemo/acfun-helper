export async function getUid(){
    let Uid = await getStorage('LocalUserId');
    if(Uid!=0){
        return Uid.LocalUserId
    }else{
        throw new UserException("Unexpected Uid,Please Navigate to www.acfun.cn First");
    }
}

export async function getResult(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((res)=>{return res.text();})
        .then((res)=>{
            let x=res;
            resolve(x);
        })
    });
}

export async function getFollowingNum() {
    return new Promise((resolve, reject) => {
    fetch(`https://www.acfun.cn/rest/pc-direct/user/personalInfo?`).then((res)=>{return res.text()})
    .then((res)=>{
        let x = JSON.parse(res);
        let followingNum = Number(x.info.following);
        resolve(followingNum)
    });
  });
}

export async function computePageNum(){
    let totalNum = await getFollowingNum();//总数
    let remainNum = totalNum%100; //剩余
    let comple = totalNum - remainNum;//整
    let multip = (comple/100)+1 //页数
    return multip
}

export async function getFollowings() {
    let Uid = await getUid();
    let Page = await computePageNum();
    let result = []
    for(let i=1;i<Page+1;i++){
        let x = JSON.parse(await getResult(`https://api-new.acfunchina.com/rest/app/relation/getFollows?toUserId=${Uid}&pcursor=&count=100&page=${i}&groupId=0&action=7`));
        result.push(x.friendList);
    }
    return new Promise((resolve, reject) => {
        resolve(result);
    })
}