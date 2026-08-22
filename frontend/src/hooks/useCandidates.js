import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates, addCandidate, updateCandidate, deleteCandidate, clearCandidateError } from '../redux/slices/candidateSlice';

export const useCandidates = () => {
  const dispatch = useDispatch();
  const { candidates, totalCandidates, totalPages, currentPage, selectedCandidate, loading, error } = useSelector((state) => state.candidates);

  const getCandidates = (filters) => dispatch(fetchCandidates(filters));
  const createCandidate = (data) => dispatch(addCandidate(data));
  const editCandidate = (id, data) => dispatch(updateCandidate({ id, data }));
  const removeCandidate = (id) => dispatch(deleteCandidate(id));
  const clearErrorState = () => dispatch(clearCandidateError());

  return {
    candidates,
    totalCandidates,
    totalPages,
    currentPage,
    selectedCandidate,
    loading,
    error,
    getCandidates,
    createCandidate,
    editCandidate,
    removeCandidate,
    clearErrorState,
  };
};
