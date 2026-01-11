import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.avatarContainer}>
            <img
              src="/img/avatar.jpg"
              alt="Avatar"
              className={styles.avatar}
            />
          </div>
          <div className={styles.heroText}>
            <Heading as="h1" className="hero__title">
              DevDubu
            </Heading>
            <p className="hero__subtitle">Developer & Tech Enthusiast</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Introduction() {
  return (
    <div className={clsx(styles.section, 'container')}>
      <Heading as="h2">Introduction</Heading>
      <p>
        안녕하세요! DevDubu 입니다. <br />
        이곳은 저의 개발 경험과 지식을 공유하는 공간입니다. <br />
        꾸준한 학습과 기록을 통해 성장하고 있습니다.
      </p>
    </div>
  );
}

function Career() {
  return (
    <div className={clsx(styles.section, 'container')}>
      <Heading as="h2">Career</Heading>
      <ul>
        <li>
          <strong>Company A</strong> - Senior Developer (2020 - Present)
          <p>주요 업무 및 성과 기술...</p>
        </li>
        <li>
          <strong>Company B</strong> - Backend Developer (2018 - 2020)
          <p>주요 업무 및 성과 기술...</p>
        </li>
      </ul>
    </div>
  );
}

function BlogInfo() {
  return (
    <div className={clsx(styles.section, 'container')}>
      <Heading as="h2">About This Blog</Heading>
      <p>
        이 블로그는 <strong>Wiki</strong>, <strong>Essays</strong>, <strong>Retros</strong>로 구성되어 있습니다.
      </p>
      <ul>
        <li><strong>Wiki</strong>: 기술적인 지식과 학습 노트를 체계적으로 정리합니다.</li>
        <li><strong>Essays</strong>: 개발에 대한 생각이나 개인적인 에세이를 작성합니다.</li>
        <li><strong>Retros</strong>: 프로젝트나 기간별 회고를 통해 배운 점을 기록합니다.</li>
      </ul>
    </div>
  );
}

export default function Home() {
  const { siteConfig, i18n } = useDocusaurusContext();

  // Gateway Redirect Logic
  if (typeof window !== 'undefined' && i18n.currentLocale === 'und') {
    window.location.href = '/ko/';
    return null; // Render nothing while redirecting
  }

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="DevDubu's Tech Blog">
      <HomepageHeader />
      <main>
        <Introduction />
        <Career />
        <BlogInfo />
      </main>
    </Layout>
  );
}
