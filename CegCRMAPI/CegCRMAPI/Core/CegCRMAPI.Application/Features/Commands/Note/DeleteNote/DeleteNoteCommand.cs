using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Commands.Note.DeleteNote
{
    public class DeleteNoteCommand : IRequest<ApiResponse<bool>>
    {
        public Guid Id { get; set; }
    }

    public class DeleteNoteCommandHandler : IRequestHandler<DeleteNoteCommand, ApiResponse<bool>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteNoteCommandHandler(INoteRepository noteRepository, IUnitOfWork unitOfWork)
        {
            _noteRepository = noteRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<bool>> Handle(DeleteNoteCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var note = await _noteRepository.GetByIdAsync(request.Id);
                if (note == null)
                    return ApiResponse<bool>.CreateError("Note not found");

                _noteRepository.Remove(note);
                await _unitOfWork.SaveChangesAsync();
                return ApiResponse<bool>.CreateSuccess(true, "Note deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.CreateError($"Failed to delete note: {ex.Message}");
            }
        }
    }
} 