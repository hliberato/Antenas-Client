import store from '../store/index'

function getProjectStatus (project) {
  const isMeetingPhase = project.progress === 5
  let hasMeeting = false

  if (project.meeting != null) {
    hasMeeting = project.meeting.chosenDate != null
  }

  const isRefused = project.refused
  const isDeliveryPhase = project.progress === 6

  const isConcluded = project.finished

  let isWaiting

  if (store.getters.isRepresentative) {
    isWaiting = project.progress === 3 || (isMeetingPhase && !hasMeeting && project.meeting.possibleDate.length)
  } else if (store.getters.isCadi) {
    isWaiting = [2, 4].includes(project.progress) || (isMeetingPhase && !project.meeting.chosenDate) || (isDeliveryPhase && !project.teacher)
  } else if (store.getters.isTeacher) {
    isWaiting = !!isDeliveryPhase
  } else if (store.getters.isStudent) {
    isWaiting = isDeliveryPhase && !project.deliver.some(entrega => entrega.students.includes(store.state.user.id))
  }

  if (isRefused) {
    return 'REFUSED'
  } else if (isConcluded) {
    return 'CONCLUDED'
  } else if (isWaiting) {
    return 'WAITING'
  } else {
    return 'PENDING'
  }
}

export const updateProject = (project, projectChanged) => {
  project.title = projectChanged.title
  project.shortDescription = projectChanged.shortDescription
  project.completeDescription = projectChanged.completeDescription
  project.technologyDescription = projectChanged.technologyDescription
  project.updatedAt = projectChanged.updatedAt
  project.createdAt = projectChanged.createdAt
  project.progress = projectChanged.progress
  project.notes = projectChanged.notes
  project.refused = projectChanged.refused
  project.reason = projectChanged.reason
  project.finished = projectChanged.finished
  project.course = projectChanged.course
  project.semester = projectChanged.semester
  project.started = projectChanged.started

  if (projectChanged.meeting != null) {
    project.meeting.chosenDate = projectChanged.meeting.chosenDate
    project.meeting.possibleDate = projectChanged.meeting.possibleDate
    project.meeting.address.place = projectChanged.meeting.address.place
    project.meeting.address.number = projectChanged.meeting.address.number
    project.meeting.address.city = projectChanged.meeting.address.city
    project.meeting.address.zipCode = projectChanged.meeting.address.zipCode
  } else {
    project.meeting.chosenDate = null
    project.meeting.possibleDate = null
    project.meeting.address.place = null
    project.meeting.address.number = null
    project.meeting.address.city = null
    project.meeting.address.zipCode = null
  }

  if (projectChanged.teacher != null) {
    project.teacher = {
      id: projectChanged.teacher
    }
  } else {
    project.teacher = null
  }

  if (projectChanged.students != null) {
    project.students = projectChanged.students
  } else {
    project.students = null
  }
  project.deliver = projectChanged.deliver
  project.studentResponsible = {
    id: projectChanged.studentResponsible
  }
}

export default { getProjectStatus, updateProject }
