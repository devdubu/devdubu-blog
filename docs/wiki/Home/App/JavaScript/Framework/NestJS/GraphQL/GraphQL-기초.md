---
sticker: vault//이미지/개발 로고/TechIconSVG/GraphQL.svg

slug: "GraphQL-기초"
---
# GraphQL의 개념

:::question GraphQL 이란?
- GraphQ은 API 용 쿼리 언어 입니다.
- GraphQL은 API의 데이터에 대한 이해하기 쉬운 설명을 제공하고, 클라이언트가 필요한 것을 정확하게 요청할 수 있는 능력을 제공합니다.

:::

![Pasted-image-20250714093032.png](/img/이미지 창고/Pasted-image-20250714093032.png)
## GraphQL의 사용 방법 순서

![Pasted-image-20250714093110.png](/img/이미지 창고/Pasted-image-20250714093110.png)
1. 데이터를 묘사하고
2. 클라이언트에서 필요한 데이터를 요청하고
3. 서버에서 예측한 데이터를 받아옵니다.

:::tip GraphQL을 사용하는 이유?
- 모든 기술이 그 전에 사용하던 기술을 보완하기 위해 나오듯 GraphQL도 REST에서 부족한 점을 보완하기 위해 출시 했습니다.
- GraphQL이 REST 보다 전체적으로 더 낫다라는 말이 아는 서로 장단점이 있기 때문에, 상황에 맞는 더 나은 것을 사용하면 됩니다.

:::

## GraphQL의 장점
:::note 프런트엔드 개발자는 백엔드 개발자가 REST API 개발을 마칠 때까지 기다리지 않아도 됩니다.
- 주로 개발 과정은 백엔드 개발자가 REST API 개발 마치고 그 후에 프런트 엔드 개발자가 그 API에 호출해서 받아온 데이터를 이용해서 화면에 데이터를 보여줍니다. 
- 하지만 GraphQL을 사용하면 프런트엔드 개발자와 백엔드 개발자가 전체 개발 프로세스를 병렬로 작업할 수 있습니다.

:::

:::note Overfetching과 Underfetching을 막아줍니다.
- REST를 이용할 때 필요한 데이터를 만들기 위해서 여러 번 요청을 보내야 할 때 GraphQL은 한 번의 요청으로 데이터를 가져올 수 있습니다.

:::

### 기존 REST API 데이터 Fetch 방법
기존에는 데이터가 필요하다면, 아래 처럼 URL 별로 데이터를 가져오게 됩니다.
- 유튜브 기본 비디오 정보
	- `https://www.youtube.api.com/video/{videoId}`
- 해당 비디오 채널 정보
	- `https://www.youtube.api.com/channel/{channelId}`
- 해당 비디오 댓글 정보
	- `https://www.youtube.api.com/video/videoId/comments`

위 처럼 3가지의 데이터가 필요하다면, 3가지의 요청을 보내야하며, URL 도 개별적으로 Fetch 작업을 진행해야 합니다.

:::warning 문제점
- 클라이언트에서 필요한 정보를 위해서 여러 번의 요청을 보내야 합니다. 
- 만약 여기서 더 정보가 필요하다면 그 요청의 숫자는 더 늘어날 것입니다.

:::

:::tip OverFetching?
- overfetching 은 데이터를 가져올 때 예를 들어서 비디오 채널 정보에서 실제 사용하는 채널 정보는 채널 이름 채널 구독자 수뿐인데 채널 생성 날짜 정보, 채널 url 등 더 많은 정보들을 받아와서 더 많은 네트워크 비용을 사용하는 것이 overfetching이며 underfetching은 overfetching과 반대로 요청에 대한 응답에 필요한 데이터가 부족하게 오는 것을 말합니다.

:::

### GraphQL 과 REST 비교표
![Pasted-image-20250714094127.png](/img/이미지 창고/Pasted-image-20250714094127.png)

# GraphQL 간단하게 살펴보기

우선 예시로는 REST API를 예시로 StarWars 관련 컨텐츠를 제공하고 있는 [사이트가](https://swapi.dev/api/) 있습니다.
해당 사이트에서 무료로 API를 RESTful 하게 제공받을 수도 있습니다.

우리는 현재 해당 사이트를 기반으로 GraphQL을 조작하려고 합니다.

우선 해당 StarWars를 API를 불러오는 [GraphQL 사이트](http://graphql.org/swapi-graphql)를 들어가겠습니다

![스크린샷-2025-07-14-오전-9.48.25.png](/img/이미지 창고/스크린샷-2025-07-14-오전-9.48.25.png)

우선 예시로 들만한 것은 아래의 경로를 예시로 들려고 합니다.
``
아래의 사이트 처럼 url은 다음과 같습니다. `https://swapi.dev/api/starships/9`

![Screenshot-2025-07-14-at-9.33.18-PM.png](/img/이미지 창고/Screenshot-2025-07-14-at-9.33.18-PM.png)

아래의 사진은 위 url을 불러올 때, GraphQL을 이용하여 해당 데이터를 추출한 모습입니다.
![Screenshot-2025-07-14-at-9.35.02-PM.png](/img/이미지 창고/Screenshot-2025-07-14-at-9.35.02-PM.png)
아래는 해당 GraphQL의 스크립트 입니다.

```graphql
{
	starship(starshipID: 9){
    name
    model
  }
}
```

![Screenshot-2025-07-14-at-9.40.21-PM.png](/img/이미지 창고/Screenshot-2025-07-14-at-9.40.21-PM.png)
## GraphQL의 특징

:::tip 프런트엔드 개발자는 백엔드 개발자가 REST API 개발을 마칠 때까지 기다리지 않아도 됩니다.
- 주로 개발 과정은 백엔드 개발자가 REST API 개발 마치고 그 후에 프런트 엔드 개발자가 그 API에 호출해서 받아온 데이터를 이용해서 화면에 데이터를 보여줍니다. 
- 하지만 GraphQL을 사용하면 프런트엔드 개발자와 백엔드 개발자가 전체 개발 프로세스를 병렬로 작업할 수 있습니다.

:::

![Screenshot-2025-07-14-at-9.43.13-PM.png](/img/이미지 창고/Screenshot-2025-07-14-at-9.43.13-PM.png)

### GraphQL의 장점

![Pasted-image-20250714214353.png](/img/이미지 창고/Pasted-image-20250714214353.png)

상단 Docs를 기반으로 query를 볼수 있으며, 해당 Query를 짜는 방식은 TypeScript에서 Type과 Interface를 지정하는 것과 매우 유사하게 진행됩니다.

| ![300](Pasted-image-20250714214443.png \) | ![200](Pasted-image-20250714214517.png \) |
| ------------------------------------------- | ------------------------------------------- |
### GraphQL의 단점
:::note 프런트엔드 개발자가 GraphQL 쓰는 법을 따로 배워야 합니다.

:::

:::note 백엔드에 Schema 및 Type을 정해줘야 합니다. (작은 앱에도 이렇게 하려면 번거로울 수 있습니다.)

:::

:::note REST API 보다 데이터를 캐싱하는게 까다롭습니다.
- REST에서 구현하는 것보다 GraphQL로 단순화된 캐시를 구현하는 것이 더 복잡합니다. 
- REST API에서는 URL을 사용하여 리소스에 액세스하므로 리소스 URL이 식별자로 있으므로 리소스 수준에서 캐시할 수 있습니다. 
- 반면 GraphQL에서는 동일한 엔터티에서 작동하더라도 각 쿼리가 다를 수 있기 때문에 매우 복잡합니다. 
- 그러나 GraphQL 위에 구축된 대부분의 라이브러리는 효율적인 캐싱 메커니즘을 제공합니다.

:::

![Pasted-image-20250714214821.png](/img/이미지 창고/Pasted-image-20250714214821.png)
- 캐싱을 위해 한 가지 가능한 패턴은 `id`와 같은 필드를 전역 고유 식별자로 예약하는 것입니다.


