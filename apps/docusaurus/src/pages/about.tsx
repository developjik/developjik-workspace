import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { 
  personalInfo, 
  skills, 
  experiences, 
  interests, 
  getSkillsByCategory, 
  getExperiencesByType 
} from '@site/src/data/profile';
import SkillBar from '@site/src/components/SkillBar';
import Timeline from '@site/src/components/Timeline';
import styles from './about.module.css';

const About: React.FC = () => {
  const [activeSkillCategory, setActiveSkillCategory] = useState<'frontend' | 'backend' | 'devops' | 'design' | 'tools'>('frontend');
  const [activeExperienceType, setActiveExperienceType] = useState<'all' | 'work' | 'education' | 'project'>('all');

  const skillCategories = [
    { key: 'frontend' as const, label: 'Frontend', icon: '🎨' },
    { key: 'backend' as const, label: 'Backend', icon: '⚙️' },
    { key: 'devops' as const, label: 'DevOps', icon: '🚀' },
    { key: 'design' as const, label: 'Design', icon: '🎭' },
    { key: 'tools' as const, label: 'Tools', icon: '🛠️' }
  ];

  const experienceTypes = [
    { key: 'all' as const, label: '전체', icon: '📋' },
    { key: 'work' as const, label: '경력', icon: '💼' },
    { key: 'education' as const, label: '교육', icon: '🎓' },
    { key: 'project' as const, label: '프로젝트', icon: '🚀' }
  ];

  const getFilteredExperiences = () => {
    return activeExperienceType === 'all' 
      ? experiences 
      : getExperiencesByType(activeExperienceType);
  };

  return (
    <Layout
      title="About Me"
      description="DevelopJik의 개인 소개, 기술 스택, 경험 및 관심사를 확인해보세요.">
      
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.profileSection}>
              <div className={styles.avatarContainer}>
                <img 
                  src={personalInfo.avatar} 
                  alt={personalInfo.name}
                  className={styles.avatar}
                />
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot}></span>
                  Available for opportunities
                </div>
              </div>
              
              <div className={styles.profileInfo}>
                <Heading as="h1" className={styles.name}>
                  안녕하세요! 👋<br />
                  저는 <span className={styles.highlight}>{personalInfo.name}</span>입니다
                </Heading>
                <p className={styles.title}>{personalInfo.title}</p>
                <p className={styles.tagline}>{personalInfo.tagline}</p>
                <p className={styles.bio}>{personalInfo.bio}</p>
                
                <div className={styles.quickStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{personalInfo.yearsOfExperience}+</span>
                    <span className={styles.statLabel}>years experience</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{skills.length}</span>
                    <span className={styles.statLabel}>skills</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{experiences.length}</span>
                    <span className={styles.statLabel}>experiences</span>
                  </div>
                </div>
                
                <div className={styles.socialLinks}>
                  <Link 
                    to={personalInfo.github}
                    className={`${styles.socialLink} ${styles.github}`}
                  >
                    <span className={styles.socialIcon}>💻</span>
                    GitHub
                  </Link>
                  <Link 
                    to={`mailto:${personalInfo.email}`}
                    className={`${styles.socialLink} ${styles.email}`}
                  >
                    <span className={styles.socialIcon}>📧</span>
                    Email
                  </Link>
                  <Link 
                    to="/portfolio"
                    className={`${styles.socialLink} ${styles.portfolio}`}
                  >
                    <span className={styles.socialIcon}>🚀</span>
                    Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          
          {/* Skills Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                💪 기술 스택
              </Heading>
              <p className={styles.sectionDescription}>
                다양한 기술들을 활용하여 문제를 해결하고 가치를 창출합니다
              </p>
            </div>
            
            <div className={styles.skillCategories}>
              {skillCategories.map((category) => (
                <button
                  key={category.key}
                  className={`${styles.categoryButton} ${activeSkillCategory === category.key ? styles.active : ''}`}
                  onClick={() => setActiveSkillCategory(category.key)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
            
            <div className={styles.skillsGrid}>
              {getSkillsByCategory(activeSkillCategory).map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                🎯 경험 & 이력
              </Heading>
              <p className={styles.sectionDescription}>
                지속적인 학습과 실전 경험을 통해 성장해왔습니다
              </p>
            </div>
            
            <div className={styles.experienceFilters}>
              {experienceTypes.map((type) => (
                <button
                  key={type.key}
                  className={`${styles.filterButton} ${activeExperienceType === type.key ? styles.active : ''}`}
                  onClick={() => setActiveExperienceType(type.key)}
                >
                  <span className={styles.filterIcon}>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
            
            <Timeline experiences={getFilteredExperiences()} />
          </section>

          {/* Interests Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heading as="h2" className={styles.sectionTitle}>
                ❤️ 관심사 & 열정
              </Heading>
              <p className={styles.sectionDescription}>
                개발자로서 관심을 가지고 있는 분야들입니다
              </p>
            </div>
            
            <div className={styles.interestsGrid}>
              {interests.map((interest, index) => (
                <div key={index} className={styles.interestCard}>
                  <div className={styles.interestHeader}>
                    <span className={styles.interestIcon}>
                      {interest.title.split(' ')[0]}
                    </span>
                    <h3 className={styles.interestTitle}>
                      {interest.title.split(' ').slice(1).join(' ')}
                    </h3>
                  </div>
                  <p className={styles.interestDescription}>
                    {interest.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.cta}>
            <div className={styles.ctaContent}>
              <Heading as="h3" className={styles.ctaTitle}>
                함께 협업하고 싶으시나요? 🤝
              </Heading>
              <p className={styles.ctaDescription}>
                새로운 도전과 협업 기회를 항상 환영합니다.<br />
                함께 멋진 프로젝트를 만들어보아요!
              </p>
              <div className={styles.ctaButtons}>
                <Link 
                  to="/portfolio" 
                  className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
                >
                  포트폴리오 보기 🚀
                </Link>
                <Link 
                  to={`mailto:${personalInfo.email}`}
                  className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
                >
                  연락하기 📧
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default About;