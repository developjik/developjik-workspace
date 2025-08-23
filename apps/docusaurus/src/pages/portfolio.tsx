import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { projects, getProjectsByStatus, getProjectsByTag } from '@site/src/data/projects';
import ProjectCard from '@site/src/components/ProjectCard';
import styles from './portfolio.module.css';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'planned'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');

  const getFilteredProjects = () => {
    let filtered = filter === 'all' ? projects : getProjectsByStatus(filter);
    
    if (tagFilter) {
      filtered = getProjectsByTag(tagFilter);
    }
    
    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  return (
    <Layout
      title="프로젝트 포트폴리오"
      description="DevelopJik의 개발 프로젝트들을 소개합니다. React, Next.js, TypeScript 등을 활용한 다양한 프로젝트 경험을 확인해보세요.">
      
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <Heading as="h1" className={styles.heroTitle}>
              🚀 프로젝트 포트폴리오
            </Heading>
            <p className={styles.heroSubtitle}>
              현대적인 웹 기술을 활용한 다양한 프로젝트들을 소개합니다
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{projects.length}</span>
                <span className={styles.statLabel}>총 프로젝트</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{getProjectsByStatus('completed').length}</span>
                <span className={styles.statLabel}>완료된 프로젝트</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{getProjectsByStatus('in-progress').length}</span>
                <span className={styles.statLabel}>진행 중</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.filters}>
            <div className={styles.statusFilters}>
              <h3 className={styles.filterTitle}>상태별 필터</h3>
              <div className={styles.filterButtons}>
                {(['all', 'completed', 'in-progress', 'planned'] as const).map((status) => (
                  <button
                    key={status}
                    className={`${styles.filterButton} ${filter === status ? styles.active : ''}`}
                    onClick={() => {
                      setFilter(status);
                      setTagFilter('');
                    }}
                  >
                    {status === 'all' ? '전체' : 
                     status === 'completed' ? '완료' : 
                     status === 'in-progress' ? '진행 중' : '기획 중'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.tagFilters}>
              <h3 className={styles.filterTitle}>태그별 필터</h3>
              <div className={styles.tagButtons}>
                <button
                  className={`${styles.tagButton} ${tagFilter === '' ? styles.active : ''}`}
                  onClick={() => {
                    setTagFilter('');
                    setFilter('all');
                  }}
                >
                  전체
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.tagButton} ${tagFilter === tag ? styles.active : ''}`}
                    onClick={() => {
                      setTagFilter(tag);
                      setFilter('all');
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                프로젝트 목록
              </Heading>
              <p className={styles.projectCount}>
                {filteredProjects.length}개의 프로젝트
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className={styles.noProjects}>
                <p>해당 조건에 맞는 프로젝트가 없습니다.</p>
              </div>
            ) : (
              <div className={styles.projectsGrid}>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <Heading as="h3" className={styles.ctaTitle}>
                함께 협업하고 싶으시나요?
              </Heading>
              <p className={styles.ctaDescription}>
                새로운 프로젝트나 협업 기회가 있다면 언제든지 연락해주세요!
              </p>
              <div className={styles.ctaButtons}>
                <a href="https://github.com/developjik" className={styles.ctaButton}>
                  GitHub 보기
                </a>
                <a href="mailto:contact@example.com" className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}>
                  이메일 보내기
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Portfolio;