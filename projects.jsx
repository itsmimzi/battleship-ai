'use client'

import { useState, useEffect } from 'react';

function goToRepo(url) {
    window.open(url, '_blank');
}

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGitHubProjects = async () => {
            try {
                setLoading(true);
                // Fetch repositories from GitHub API
                const response = await fetch('https://api.github.com/users/itsmimzi/repos?sort=updated&per_page=10');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }
                
                const repos = await response.json();
                
                // Filter out forks and map to our project structure
                const filteredProjects = repos
                    .filter(repo => !repo.fork) // Exclude forked repositories
                    .map(repo => ({
                        id: repo.id,
                        title: repo.name,
                        description: repo.description || 'No description available',
                        url: repo.html_url,
                        language: repo.language,
                        stars: repo.stargazers_count,
                        updatedAt: repo.updated_at
                    }));
                
                setProjects(filteredProjects);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching GitHub projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubProjects();
    }, []);

    if (loading) {
        return (
            <div className="projects-container">
                <section className="projects-wrapper">
                    <div className="page-title">Projects</div>
                    <div className="loading-message">Loading projects...</div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-container">
                <section className="projects-wrapper">
                    <div className="page-title">Projects</div>
                    <div className="error-message">Error loading projects: {error}</div>
                </section>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <section className="projects-wrapper">
                <div className="page-title">
                    Projects
                </div>
                {projects.map((project) => (
                    <div key={project.id} className="project-wrapper">
                        <div className="project-title">
                            {project.title}
                        </div>
                        <p className="project-description">
                            {project.description}
                        </p>
                        {project.language && (
                            <div className="project-language">
                                Language: {project.language}
                            </div>
                        )}
                        {project.stars > 0 && (
                            <div className="project-stars">
                                ⭐ {project.stars}
                            </div>
                        )}
                        <button
                            className="learn-more-button"
                            onClick={() => goToRepo(project.url)}
                        >
                            →
                        </button>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="no-projects-message">
                        No projects found.
                    </div>
                )}
            </section>
        </div>
    );
}