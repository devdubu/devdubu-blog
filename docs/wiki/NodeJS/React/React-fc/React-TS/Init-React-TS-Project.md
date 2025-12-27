---
slug: "Init-React-TS-Project"
---
# 필수 패키지 설치
```bash
npm init vite
```

```bash
npm install dayjs html-react-parser @reduxjs/toolkit react-quill uuid react-toastify styled-components react-icons react-router-dom react-redux
```

```bash
npm i --save-dev @types/styled-components @types/uuid
```

# 폴더 구조
![Screenshot-2023-08-14-at-2.16.06-PM.png](/img/이미지 창고/Screenshot-2023-08-14-at-2.16.06-PM.png)

## styles, types, utills 파일 구조
![Screenshot-2023-08-14-at-2.18.12-PM.png](/img/이미지 창고/Screenshot-2023-08-14-at-2.18.12-PM.png)

## pages, store 파일 구조
![Screenshot-2023-08-14-at-2.28.37-PM.png](/img/이미지 창고/Screenshot-2023-08-14-at-2.28.37-PM.png)

# Component 파일 구조
![Screenshot-2023-08-14-at-6.20.17-PM.png](/img/이미지 창고/Screenshot-2023-08-14-at-6.20.17-PM.png)

# React Router Dom 설정하기
```tsx
<BrowserRouter>
	<Sidebar />
	<div className='app__container'>
	<Navbar />
	{/* 위 사이드, 메뉴 컴포넌트를 직접 넣어도 되고, Layout을 구현해서, 중첩해서 넣어도 된다.*/}
	<Routes>
		<Route path='/' element={<AllNotes />} />
		<Route path='/archive' element={<ArchiveNotes />} />
		<Route path='/trash' element={<TrashNotes />} />
		<Route path='/tag/:name' element={<TagNotes />} />
		<Route path='/404' element={<ErrorPage />} />
		<Route path='/*' element={<Navigate to={"/404"} />} />
	</Routes>
</div>
</BrowserRouter>
```

# Type 생성하기
- 폴더를 만들었던 `Type` 디렉토리 안에 있는 쪽에 생성한다.
```ts
import { Tag } from "./tag";

export interface Note {
	title: string;
	content: string;
	tags: Tag[];
	color: string;
	priority: string;
	isPinned: boolean;
	isRead: boolean;
	date: string;
	createdTime: number;
	editedTime: null | number;
	id: string;
}
```
`note.ts`
- note 컴포넌트에서 사용하는 변수들의 타입을 미리 지정하여서 사용하게끔 한다.

```ts
export interface Tag {
	tag: string;
	id: string;
}
```
`tag.ts`
- tag 또한 각 컴포넌트 들에서 사용하는 타입을 미리 지정해서 각 타입을 맞춘다.

# ErrorPage 생성
```tsx
import React from 'react'
import { Container } from './ErrorPage.styles'
import img from '../../assets/errorImg.png';
import { ButtonFill } from '../../styles/styles';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
 
	const navigate = useNavigate();

	return (
		<Container>
			<div className='error__img'>
				<img src={img} alt="pageNotFound" />
			</div>
			<div className='error__text'>
				<h1>404</h1>
				<div>에러가 발견되었습니다.</div>
				<ButtonFill onClick={() => navigate('/')}>
					<span>메인 페이지로 돌아가기</span>
				</ButtonFill>
			</div>
		</Container>
	)
}

export default ErrorPage
```
`pages/ErrorPage.tsx`
# Redux 사용을 위한 준비

## store 파일 작성

### menuSlice.ts
```ts
import { createSlice } from "@reduxjs/toolkit";

// 타입 지정후에 아래 initalState에 해당 타입을 주입 시켜주는 것이 JS와 가장 큰 차이점
interface MenuState {
	isOpen: boolean;
}

const initialState: MenuState = {
	isOpen: false
}

const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		toggleMenu: (state, action) => {
			state.isOpen = action.payload
		}
	}
})

export const { toggleMenu } = menuSlice.actions;
export default menuSlice.reducer;
```
`store/menu/menuSlice.ts`

### modalSlice.ts
```ts
import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
	viewEditTagsModal: boolean,
	viewAddTagsModal: boolean,
	viewCreateNoteModal: boolean,
	viewFiltersModal: boolean
}

  

const initialState: ModalState = {
	viewEditTagsModal: false,
	viewAddTagsModal: false,
	viewCreateNoteModal: false,
	viewFiltersModal: false
}

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		toggleTagsModal: (state, { payload }) => {
			//tag를 여는 모달
			const { type, view } = payload;
			if (type === "add") {
				//Tag를 추가하는 모달
				state.viewAddTagsModal = view;
			} else {
				// Tag를 편집하는 모달
				state.viewEditTagsModal = view;
			}
		},
		// 토글을 만들기 위해서 여는 모달
		toggleCreateNoteModal: (state, action) => {
			state.viewCreateNoteModal = action.payload;
		},
		// 정렬을 하기 위해서 띄우는 모달
		toggleFiltersModal: (state, action) => {
			state.viewFiltersModal = action.payload
		},
	}
})

export const { toggleTagsModal, toggleCreateNoteModal, toggleFiltersModal } = modalSlice.actions;
export default modalSlice.reducer;
```
`store/modal/modalSlice.ts`

```ts
import { createSlice } from "@reduxjs/toolkit";
import notes from "../../notesData";
import { Note } from "../../types/note";
// 이전에 만들어놨던 Note type을 사용함
interface NoteState {
	mainNotes: Note[],
	archiveNotes: Note[],
	trashNotes: Note[],
	editNote: null | Note
}

const initialState: NoteState = {
	mainNotes: [...notes],
	archiveNotes: [],
	trashNotes: [],
	editNote: null
} 

enum noteType {
	mainNotes = 'mainNotes',
	archiveNotes = 'archiveNotes',
	trashNotes = 'trashNotes'
}

const notesListSlice = createSlice({
	name: "notesList",
	initialState,
	reducers: {
		setMainNotes: (state, { payload }) => {
		// 해당 note 수정
		if (state.mainNotes.find(({ id }) => id === payload.id)) {
			state.mainNotes = state.mainNotes.map((note) =>
			note.id === payload.id ? payload : note)
		}
		// note를 새롭게 생성
		else {
			state.mainNotes.push(payload);
		}
		},
		setTrashNotes: (state, { payload }) => {
			state.mainNotes = state.mainNotes.filter(({ id }) => id !== payload.id);
			state.archiveNotes = state.archiveNotes.filter(({ id }) => id !== payload.id);
			state.trashNotes.push({ ...payload, isPinned: false })
		},
		setArchiveNotes: (state, { payload }) => {
			state.mainNotes = state.mainNotes.filter(({ id }) => id !== payload.id);
			state.archiveNotes.push({ ...payload, isPinned: false })
		},
	
		unArchiveNote: (state, { payload }) => {
			state.archiveNotes = state.archiveNotes.filter(({ id }) => id !== payload.id);
			state.mainNotes.push(payload)
		},
		restoreNote: (state, { payload }) => {
			state.trashNotes = state.trashNotes.filter(({ id }) => id !== payload.id);
			state.mainNotes.push(payload)
		},
	
		deleteNote: (state, { payload }) => {
			state.trashNotes = state.trashNotes.filter(({ id }) => id !== payload.id);
		},
		setPinnedNotes: (state, { payload }) => {
			state.mainNotes = state.mainNotes.map((note) =>
			note.id === payload.id ? { ...note, isPinned: !note.isPinned } : note)
		},
		setEditNote: (state, { payload }) => {
			state.editNote = payload;
		},
		readNote: (state, { payload }) => {
			const { type, id } = payload;
			const setRead = (notes: noteType) => {
				state[notes] = state[notes].map((note: Note) =>
				note.id === id ? { ...note, isRead: !note.isRead } : note)
			}
	
			if (type === "archive") {
				setRead(noteType.archiveNotes)
			} else if (type === "trash") {
				setRead(noteType.trashNotes)
			} else {
				setRead(noteType.mainNotes)
			}
		},
		removeTags: (state, { payload }) => {
			state.mainNotes = state.mainNotes.map((note) => ({
				...note,
				tags: note.tags.filter(({ tag }) => tag !== payload.tag)
			}))
		}
	}
})

export const {
	setMainNotes,
	setTrashNotes,
	setArchiveNotes,
	unArchiveNote,
	restoreNote,
	deleteNote,
	setPinnedNotes,
	setEditNote,
	readNote,
	removeTags
} = notesListSlice.actions;
export default notesListSlice.reducer;

```
`store/notesList/notesListSlice.ts`

```ts
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 } from 'uuid';

const initialState = {
	tagsList: [
		{ tag: "coding", id: v4() },
		{ tag: "exercise", id: v4() },
		{ tag: "quotes", id: v4() }
	]
}

const tagsSlice = createSlice({
	name: "tags",
	initialState,
	reducers: {
		addTags: (state, { payload }) => {
			if (state.tagsList.find(({ tag }) => tag === payload.tag)) {
				toast.warning("이미 존재하는 태그입니다.");
			} else {
				state.tagsList.push(payload);
				toast.info("새로운 태그가 등록되었습니다.");
			}
		},
		deleteTags: (state, { payload }) => {
			state.tagsList = state.tagsList.filter(({ id }) => id !== payload)
			toast.info("태그가 삭제되었습니다.");
		}
	}
})

export const { addTags, deleteTags } = tagsSlice.actions;
export default tagsSlice.reducer;
```
`store/tags/tagsSlice`

```ts
import { configureStore } from "@reduxjs/toolkit";
import menuReducer from './menu/menuSlice';
import modalReducer from './modal/modalSlice';
import notesListReducer from './notesList/notesListSlice';
import tagsReducer from './tags/tagsSlice';

export const store = configureStore({
	reducer: {
		menu: menuReducer,
		modal: modalReducer,
		tags: tagsReducer,
		notesList: notesListReducer
	}
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
`store/index.ts`

## hooks
```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
`hooks/redux.ts`

### main.ts에 추가하기
```ts
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<App />
	</Provider>
	,
)
```
- Provider 부분에 store를 추가해준다.

# Navbar
```tsx
import React from 'react'
import { Container, StyledNav } from './Navbar.styles'
import { FiMenu } from 'react-icons/fi';
import { ButtonFill } from '../../styles/styles';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { toggleMenu } from '../../store/menu/menuSlice';
import { toggleCreateNoteModal } from '../../store/modal/modalSlice';
import getStandardName from '../../utils/getStandardName';

const Navbar = () => {
	const dispatch = useAppDispatch();
	const { pathname, state } = useLocation()
	console.log(state);
	if (pathname === "/404") {
		return null;
	}

	return (
		<StyledNav>
			<div className='nav__menu'>
				<FiMenu onClick={() => dispatch(toggleMenu(true))} />
					{/*해당 부분은 폭이 작아진다면, 메뉴를 동적으로 옆에서 나오는 toggle 형식으로 교체 하
						기 위해서 나온 옵션이다.*/}
			</div>
			<Container>
			{/*getStandardName으로 처음에는 대문자 나중 글자는 소문자로 대응 될 수 있다.*/}
				<div className='nav__page-title'>{getStandardName(state)} </div>
				{/*페이지 이동시에, 어떤 페이지인지 표기를 한다. 그때 Trash, Archive 가 아닐때 해당 버튼을 보여주는 메서드 이다.*/}
				{state !<mark> "Trash" && state !</mark> "Archive" &&
					<ButtonFill
						onClick={() => dispatch(toggleCreateNoteModal(true))}
						className="nav__btn" >
						<span>+</span>
				{/*모달 창을 띄울지 말지를 알려주는 toggle 이때의 모달은 Note를 생성하는 모달*/}
					</ButtonFill>
				}
			</Container>
		</StyledNav>
	)
}
export default Navbar
```
`layout/Navbar.tsx`

```ts
const getStandardName = (name: string) => {
	return (
		name?.slice(0, 1).toUpperCase() + name?.slice(1, name.length).toLocaleLowerCase()
	)
}
export default getStandardName;
```
`utils/getStandardName.ts`

```ts
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, MainBox, StyledLogo, ItemsBox } from './Sidebar.sytles';

const Sidebar = () =>{
	const dispatch = useAppDispatch();
	const { isOpen } = useAppSelector((state) => state.menu);
		
	const { pathname } = useLocation();

	if(pathname==="/404"){
		return null;
	}
	
	return(
		<Container openMenu={isOpen ? "open" : "" }>
			<MainBox openMenu={isOpen ? "open" : "" }>
				<StyledLogo>
					<h1>Keep</h1>
				</StyledLogo>
				
				<ItemsBox>
				
				</ItemsBox>
			</MainBox>
		</Container>
	
		
	)
}

export default Sidebar
```

---

#React #FrontEnd 

---