import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '⚡ 빠른 개발 환경',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Turborepo와 pnpm을 활용한 모던 모노레포 구조로
        빠르고 효율적인 개발 환경을 제공합니다.
      </>
    ),
  },
  {
    title: '🎯 실무 중심 학습',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Next.js 15, React 19, TypeScript를 활용한
        최신 기술 스택으로 실무에 바로 적용 가능한 지식을 습득하세요.
      </>
    ),
  },
  {
    title: '🚀 확장 가능한 아키텍처',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        컴포넌트 라이브러리, 공유 설정, 워크스페이스 관리까지
        확장 가능한 모던 프론트엔드 아키텍처를 경험해보세요.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className={styles.featureContent}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description as React.ReactNode}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
