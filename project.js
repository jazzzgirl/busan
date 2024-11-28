const initialLat = 35.1795543;
const initialLng = 129.0756416;
var mapContainer = document.getElementById('map');
var mapOption = {
  center: new kakao.maps.LatLng(initialLat, initialLng),
  level: 9
};
var map = new kakao.maps.Map(mapContainer, mapOption);
var clusterer = new kakao.maps.MarkerClusterer({
  map: map,
  averageCenter: true,
  minLevel: 9
});
var markers = [];

function showMap(category) {
    // 모든 버튼의 활성화 상태 제거
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 클릭된 버튼 활성화
    document.querySelector(`button[onclick="showMap('${category}')"]`).classList.add('active');
    
    // 기존 지도 관련 코드
    map.setLevel(8);
    map.setCenter(new kakao.maps.LatLng(35.1795543, 129.0756416));
    
    clusterer.clear();
    
    // 버튼을 누를 때마다 지도 초기화
    map.setLevel(9); // 초기 지도 레벨 설정
    map.panTo(new kakao.maps.LatLng(initialLat, initialLng)); // 초기 지도 중심으로 이동
    // 이전 마커 제거
    clusterer.clear();
    markers = [];

    let url;
    if (category === '맛집') {
        const url = 'https://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&numOfRows=100&resultType=json';
    
    fetch(url)
    .then(res => res.json())   // json 파일을 객체로 변환
    .then(json => {                     
    console.log(json);  
    const data = json.getFoodKr.item;   // 객체에서 실제 내용만 data로 저장       


     // 마커들을 모아놓을 변수

    var markers = [];

    for(let i = 0; i<data.length;i++){
        var marker = new kakao.maps.Marker({
            map:map,
            position: new kakao.maps.LatLng(data[i].LAT,data[i].LNG)

        });

        kakao.maps.event.addListener(marker, 'click', function() {
            var message = `
                <div class="detail-card">
                    <div class="card-header">
                        <h3>${data[i].MAIN_TITLE || '정보 없음'}</h3>
                    </div>
                    <div class="card-body">
                        <div class="detail-item">
                            <div class="item-icon">📍</div>
                            <div class="item-content">
                                <span class="label">주소</span>
                                <span class="value">${data[i].ADDR1 || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📞</div>
                            <div class="item-content">
                                <span class="label">전화번호</span>
                                <span class="value">${data[i].CNTCT_TEL || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">🍽️</div>
                            <div class="item-content">
                                <span class="label">대표메뉴</span>
                                <span class="value">${data[i].RPRSNTV_MENU || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">ℹ️</div>
                            <div class="item-content">
                                <span class="label">특징</span>
                                <span class="value">${data[i].ITEMCNTNTS || '정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            var resultDiv = document.getElementById('result'); 
            resultDiv.innerHTML = message;
        });

        markers.push(marker);

        var infowindow = new kakao.maps.InfoWindow({
            content : data[i].MAIN_TITLE
        });
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
        // 마커에서 마우스아웃하면 makeOutListener() 실행
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infowindow.open(map, marker);          
        };
    }


    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    };
    clusterer.addMarkers(markers);
    });
    } else if(category === '병원') {
        const url = 'https://apis.data.go.kr/6260000/MedicInstitService/getMedicInstitInfo?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&pageNo=1&numOfRows=100&resultType=json';
        
        fetch(url)
        .then(res => res.json())
        .then(json => {
            // API 응답 구조 확인을 위한 로그
            console.log('전체 응답:', json);
            
            // 데이터 경로 수정
            const data = json.getMedicInstitInfo.body.items.item;
            console.log('병원 데이터:', data);

            var markers = [];

            for(let i = 0; i < data.length; i++) {
                // 위도, 경도 값 확인
                console.log(`병원 ${i}:`, data[i].latitude, data[i].longitude);
                
                // 위도, 경도가 있는 경우에만 마커 생성
                if(data[i].latitude && data[i].longitude) {
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(data[i].latitude, data[i].longitude)
                    });

                    kakao.maps.event.addListener(marker, 'click', function() {
                        var message = `
                            <div class="detail-card">
                                <div class="card-header">
                                    <h3>${data[i].instit_nm || '정보 없음'}</h3>
                                </div>
                                <div class="card-body">
                                    <div class="detail-item">
                                        <div class="item-icon">📍</div>
                                        <div class="item-content">
                                            <span class="label">주소</span>
                                            <span class="value">${data[i].street_nm_addr || '정보 없음'}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="item-icon">📞</div>
                                        <div class="item-content">
                                            <span class="label">전화번호</span>
                                            <span class="value">${data[i].tel || '정보 없음'}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="item-icon">🏥</div>
                                        <div class="item-content">
                                            <span class="label">진료과목</span>
                                            <span class="value">${data[i].exam_part || '정보 없음'}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="item-icon">⚕️</div>
                                        <div class="item-content">
                                            <span class="label">의료기관종별</span>
                                            <span class="value">${data[i].instit_kind || '정보 없음'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        var resultDiv = document.getElementById('result');
                        resultDiv.innerHTML = message;
                    });

                    markers.push(marker);

                    var infowindow = new kakao.maps.InfoWindow({
                        content: data[i].instit_nm
                    });

                    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
                }
            }

            // 클러스터러에 마커 추가
            clusterer.addMarkers(markers);
            
            // 모든 마커가 보이도록 지도 범위 재설정
            if (markers.length > 0) {
                const bounds = new kakao.maps.LatLngBounds();
                markers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                });
                map.setBounds(bounds);
            }
        })
        .catch(error => {
            console.error('병원 데이터 로드 에러:', error);
        });
    } else if(category === '명소') {
        const url = 'https://apis.data.go.kr/6260000/AttractionService/getAttractionKr?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&numOfRows=100&resultType=json';
    
    fetch(url)
    .then(res => res.json())   // json 파일을 객체로 변환
    .then(json => {                     
    console.log(json);  
    const data = json.getAttractionKr.item;   // 객체에서 실제 내용만 data로 저장
    console.log(data);       


     // 마커들을 모아놓을 변수

    var markers = [];

    for(let i = 0; i<data.length;i++){
        var marker = new kakao.maps.Marker({
            map:map,
            position: new kakao.maps.LatLng(data[i].LAT,data[i].LNG)

        });

        kakao.maps.event.addListener(marker, 'click', function() {
            var message = `
                <div class="detail-card">
                    <div class="card-header">
                        <h3>${data[i].MAIN_TITLE || '정보 없음'}</h3>
                    </div>
                    <div class="card-body">
                        <div class="detail-item">
                            <div class="item-icon">📍</div>
                            <div class="item-content">
                                <span class="label">주소</span>
                                <span class="value">${data[i].ADDR1 || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📞</div>
                            <div class="item-content">
                                <span class="label">전화번호</span>
                                <span class="value">${data[i].CNTCT_TEL || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">⏰</div>
                            <div class="item-content">
                                <span class="label">이용시간</span>
                                <span class="value">${data[i].USAGE_DAY_WEEK_AND_TIME || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">ℹ️</div>
                            <div class="item-content">
                                <span class="label">설명</span>
                                <span class="value">${data[i].ITEMCNTNTS || '정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = message;
        });

        markers.push(marker);

        var infowindow = new kakao.maps.InfoWindow({
            content : data[i].MAIN_TITLE
        });
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
        // 마커에서 마우스아웃하면 makeOutListener() 실행
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infowindow.open(map, marker);          
        };
    }


    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    };
    clusterer.addMarkers(markers);
    });//피치 끝    
    }else if(category === '쇼핑'){
    const url = 'https://apis.data.go.kr/6260000/ShoppingService/getShoppingKr?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&numOfRows=100&resultType=json';
    
    fetch(url)
    .then(res => res.json())   // json 파일을 객체로 변환
    .then(json => {                     
    console.log(json);  
    const data = json.getShoppingKr.item;   // 객체에서 실제 내용만 data로 저장       


    // 마커들을 모아놓을 변수

    var markers = [];

    for(let i = 0; i<data.length;i++){
        var marker = new kakao.maps.Marker({
            map:map,
            position: new kakao.maps.LatLng(data[i].LAT,data[i].LNG)

        });

        kakao.maps.event.addListener(marker, 'click', function() {
            var message = `
                <div class="detail-card">
                    <div class="card-header">
                        <h3>${data[i].MAIN_TITLE || '정보 없음'}</h3>
                    </div>
                    <div class="card-body">
                        <div class="detail-item">
                            <div class="item-icon">📍</div>
                            <div class="item-content">
                                <span class="label">주소</span>
                                <span class="value">${data[i].ADDR1 || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📞</div>
                            <div class="item-content">
                                <span class="label">전화번호</span>
                                <span class="value">${data[i].CNTCT_TEL || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">⏰</div>
                            <div class="item-content">
                                <span class="label">영업시간</span>
                                <span class="value">${data[i].USAGE_DAY_WEEK_AND_TIME || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">🚌</div>
                            <div class="item-content">
                                <span class="label">교통정보</span>
                                <span class="value">${data[i].TRFC_INFO || '정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = message;
        });

        markers.push(marker);

        var infowindow = new kakao.maps.InfoWindow({
            content : data[i].MAIN_TITLE
        });
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
        // 마커에서 마우스아웃하면 makeOutListener() 실행
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infowindow.open(map, marker);          
        };
    }


    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    };
    clusterer.addMarkers(markers);
    });//피치 끝    
    }else if(category === '안내소'){
    const url = 'https://apis.data.go.kr/6260000/InfoOfficeService/getInfoOfficeKr?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&numOfRows=30&resultType=json';
    
    fetch(url)
    .then(res => res.json())   // json 파일을 객체로 변환
    .then(json => {                     
    console.log(json);  
    const data = json.getInfoOfficeKr.item;   // 객체에서 실제 내용만 data로 저장
    console.log(data);       


    // 마커들을 모아놓을 변수

    var markers = [];

    for(let i = 0; i<data.length;i++){
        var marker = new kakao.maps.Marker({
            map:map,
            position: new kakao.maps.LatLng(data[i].LAT,data[i].LNG)

        });

        kakao.maps.event.addListener(marker, 'click', function() {
            var message = `
                <div class="detail-card">
                    <div class="card-header">
                        <h3>${data[i].NM || '정보 없음'}</h3>
                    </div>
                    <div class="card-body">
                        <div class="detail-item">
                            <div class="item-icon">📍</div>
                            <div class="item-content">
                                <span class="label">주소</span>
                                <span class="value">${data[i].ADDR1 || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📞</div>
                            <div class="item-content">
                                <span class="label">전화번호</span>
                                <span class="value">${data[i].INQRY_TEL || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">⏰</div>
                            <div class="item-content">
                                <span class="label">운영시간</span>
                                <span class="value">${data[i].OP_TIME || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">🌐</div>
                            <div class="item-content">
                                <span class="label">지원 언어</span>
                                <span class="value">${data[i].FGGG || '정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = message;
        });

        markers.push(marker);

        var infowindow = new kakao.maps.InfoWindow({
            content : data[i].NM
        });
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
        // 마커에서 마우스아웃하면 makeOutListener() 실행
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infowindow.open(map, marker);          
        };
    }


    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    };
    clusterer.addMarkers(markers);
    });//피치 끝    
    }else if(category === '축제'){
    const url = 'https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=T%2Bc7%2Bf0SA1t%2F03BtV91spGIndZbP1J%2B6xjJ5kKoe%2B9CTzHoZO96BfqUR2ergvvpBXNSjdx6qgD29R%2FPUIfNFig%3D%3D&numOfRows=100&resultType=json';
    
    fetch(url)
    .then(res => res.json())   // json 파일을 객체로 변환
    .then(json => {                     
    console.log(json);  
    const data = json.getFestivalKr.item;   // 객체에서 실제 내용만 data로 저장
    console.log(data);       


    // 마커들을 모아놓을 변수

    var markers = [];

    for(let i = 0; i<data.length;i++){
        var marker = new kakao.maps.Marker({
            map:map,
            position: new kakao.maps.LatLng(data[i].LAT,data[i].LNG)

        });

        kakao.maps.event.addListener(marker, 'click', function() {
            var message = `
                <div class="detail-card">
                    <div class="card-header">
                        <h3>${data[i].MAIN_TITLE || '정보 없음'}</h3>
                    </div>
                    <div class="card-body">
                        <div class="detail-item">
                            <div class="item-icon">📍</div>
                            <div class="item-content">
                                <span class="label">주소</span>
                                <span class="value">${data[i].ADDR1 || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📞</div>
                            <div class="item-content">
                                <span class="label">전화번호</span>
                                <span class="value">${data[i].CNTCT_TEL || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">📅</div>
                            <div class="item-content">
                                <span class="label">축제 기간</span>
                                <span class="value">${data[i].USAGE_DAY_WEEK_AND_TIME || '정보 없음'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="item-icon">ℹ️</div>
                            <div class="item-content">
                                <span class="label">축제 설명</span>
                                <span class="value">${data[i].ITEMCNTNTS || '정보 없음'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = message;
        });

        markers.push(marker);

        var infowindow = new kakao.maps.InfoWindow({
            content : data[i].MAIN_TITLE
        });
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
        // 마커에서 마우스아웃하면 makeOutListener() 실행
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        
    }

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infowindow.open(map, marker);          
        };
    }


    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infowindow.close();
        };
    };
    clusterer.addMarkers(markers);
    });//피치 끝    
    }
    
}

// 마커를 생성하고 지도에 표시하는 함수
function addMarker(position, data) {
    const marker = new kakao.maps.Marker({
        position: position,
        map: map
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', function() {
        showDetailInfo(data);
    });

    return marker;
}

// 상세 정보 표시 함수
function showDetailInfo(data) {
    const detailDiv = document.getElementById('centerDetail');
    const detailContent = document.getElementById('detailContent');
    
    detailContent.innerHTML = `
        <div class="detail-card">
            <div class="card-header">
                <h3>${data.name || data.centerName || '정보 없음'}</h3>
            </div>
            <div class="card-body">
                <div class="detail-item">
                    <div class="item-icon">📍</div>
                    <div class="item-content">
                        <span class="label">주소</span>
                        <span class="value">${data.address || '정보 없음'}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="item-icon">📞</div>
                    <div class="item-content">
                        <span class="label">전화번호</span>
                        <span class="value">${data.tel || data.phone || '정보 없음'}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="item-icon">⏰</div>
                    <div class="item-content">
                        <span class="label">운영시간</span>
                        <span class="value">${data.operatingTime || data.time || '정보 없음'}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="item-icon">ℹ️</div>
                    <div class="item-content">
                        <span class="label">설명</span>
                        <span class="value">${data.description || '정보 없음'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    detailDiv.style.display = 'block';
}
