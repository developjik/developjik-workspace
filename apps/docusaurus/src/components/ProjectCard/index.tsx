import React from 'react';
import Link from '@docusaurus/Link';
import { Project } from '@site/src/data/projects';
import styles from './styles.module.css';

interface ProjectCardProps {
  project: Project;
}

const StatusBadge: React.FC<{ status: Project['status'] }> = ({ status }) => {
  const getStatusInfo = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return { text: '완료', className: styles.statusCompleted };
      case 'in-progress':
        return { text: '진행 중', className: styles.statusInProgress };
      case 'planned':
        return { text: '기획 중', className: styles.statusPlanned };
    }
  };

  const { text, className } = getStatusInfo(status);

  return <span className={`${styles.statusBadge} ${className}`}>{text}</span>;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectImageContainer}>
        <img 
          src={project.image} 
          alt={project.title}
          className={styles.projectImage}
        />
        <div className={styles.statusOverlay}>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className={styles.projectContent}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectPeriod}>
            {project.startDate} {project.endDate ? `- ${project.endDate}` : ''}
          </p>
        </div>

        <p className={styles.projectDescription}>
          {project.description}
        </p>

        <div className={styles.techStack}>
          {project.techStack.map((tech, index) => (
            <span key={index} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.projectTags}>
          {project.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        <div className={styles.projectLinks}>
          {project.githubUrl && (
            <Link
              to={project.githubUrl}
              className={`${styles.projectLink} ${styles.githubLink}`}
            >
              <span className={styles.linkIcon}>📁</span>
              코드 보기
            </Link>
          )}
          {project.demoUrl && (
            <Link
              to={project.demoUrl}
              className={`${styles.projectLink} ${styles.demoLink}`}
            >
              <span className={styles.linkIcon}>🚀</span>
              데모 보기
            </Link>
          )}
          {project.documentUrl && (
            <Link
              to={project.documentUrl}
              className={`${styles.projectLink} ${styles.docLink}`}
            >
              <span className={styles.linkIcon}>📖</span>
              문서 보기
            </Link>
          )}
        </div>

        <div className={styles.highlights}>
          <h4 className={styles.highlightsTitle}>주요 특징</h4>
          <ul className={styles.highlightsList}>
            {project.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className={styles.highlight}>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;